import { useSyncExternalStore } from 'react'
import { getAuthRecord, setAuthRecord, type AuthRecord } from '../data/store'

/*
  Client-side admin authentication.
  - Login uses username + password only (no email).
  - First admin is auto-seeded with username "admin" and password "cndadmin2024".
  - Additional users can only be created from inside the admin panel (Settings page).
  - Passwords are stored only as salted PBKDF2 hashes; the session lives in sessionStorage (cleared on tab close, 8h max).
  - IMPORTANT: browser-only auth cannot truly protect data. Before going live, replace this module and the
    Repository in data/store.ts with a server-side API (auth + database + file storage).
*/

const SESSION_KEY = 'cnd-admin-session'
const SESSION_MS = 8 * 60 * 60 * 1000
const enc = new TextEncoder()

const toHex = (buf: ArrayBuffer) => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('')
function randomHex(bytes = 16) {
  return toHex(crypto.getRandomValues(new Uint8Array(bytes)).buffer)
}
async function hashPassword(password: string, salt: string) {
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: enc.encode(salt), iterations: 150_000 }, key, 256)
  return toHex(bits)
}

interface Session { username: string; name: string; expires: number }
const listeners = new Set<() => void>()
let cached: Session | null | undefined

function readSession(): Session | null {
  if (cached !== undefined && (!cached || cached.expires > Date.now())) return cached
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    const s = raw ? (JSON.parse(raw) as Session) : null
    cached = s && s.expires > Date.now() ? s : null
  } catch { cached = null }
  return cached
}
function writeSession(s: Session | null) {
  if (s) sessionStorage.setItem(SESSION_KEY, JSON.stringify(s))
  else sessionStorage.removeItem(SESSION_KEY)
  cached = s
  listeners.forEach(l => l())
}
export function useSession() {
  return useSyncExternalStore(
    cb => { listeners.add(cb); return () => listeners.delete(cb) },
    readSession,
  )
}

/** Seeds the default admin account on first load if none exists. */
export async function seedDefaultAdmin() {
  const existing = await getAuthRecord()
  if (existing) return
  const salt = randomHex()
  const rec: AuthRecord = {
    name: 'Admin',
    email: 'admin',
    salt,
    hash: await hashPassword('cndadmin2024', salt),
  }
  await setAuthRecord(rec)
}

export const hasAdminAccount = async () => !!(await getAuthRecord())

/** Create / replace admin user — only callable from inside the admin panel after login. */
export async function createAdminUser(username: string, password: string, displayName: string) {
  const salt = randomHex()
  const rec: AuthRecord = {
    name: displayName || username,
    email: username.trim().toLowerCase(),
    salt,
    hash: await hashPassword(password, salt),
  }
  await setAuthRecord(rec)
}

let fails = 0
let lockedUntil = 0
export async function login(username: string, password: string): Promise<'ok' | 'invalid' | 'locked'> {
  if (Date.now() < lockedUntil) return 'locked'
  const rec = await getAuthRecord()
  const ok =
    !!rec &&
    rec.email === username.trim().toLowerCase() &&
    (await hashPassword(password, rec.salt)) === rec.hash
  if (!ok) {
    fails++
    if (fails >= 5) { lockedUntil = Date.now() + 30_000; fails = 0 }
    return 'invalid'
  }
  fails = 0
  writeSession({ username: rec.email, name: rec.name, expires: Date.now() + SESSION_MS })
  return 'ok'
}
export const logout = () => writeSession(null)

export async function verifyPassword(password: string) {
  const rec = await getAuthRecord()
  return !!rec && (await hashPassword(password, rec.salt)) === rec.hash
}
export async function updateAdmin(patch: { name?: string; username?: string; newPassword?: string }) {
  const rec = await getAuthRecord()
  if (!rec) throw new Error('No admin account')
  const next = { ...rec }
  if (patch.name) next.name = patch.name
  if (patch.username) next.email = patch.username.trim().toLowerCase()
  if (patch.newPassword) {
    next.salt = randomHex()
    next.hash = await hashPassword(patch.newPassword, next.salt)
  }
  await setAuthRecord(next)
  const session = readSession()
  writeSession({ username: next.email, name: next.name, expires: session?.expires ?? Date.now() + SESSION_MS })
}
