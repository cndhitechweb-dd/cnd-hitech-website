/*
  Admin authentication using Vercel environment variables.

  Credentials are set in Vercel Dashboard → Project → Settings → Environment Variables:
    VITE_ADMIN_USERNAME   →  your chosen username  (e.g. cndadmin)
    VITE_ADMIN_PASSWORD   →  your chosen password  (e.g. MySecret@2024)

  To change credentials: update the env vars in Vercel → Redeploy.
  Works in every browser and device — no local storage needed.
*/

import { useSyncExternalStore } from 'react'

const ADMIN_USER = (import.meta.env.VITE_ADMIN_USERNAME as string | undefined)?.trim() ?? 'admin'
const ADMIN_PASS = (import.meta.env.VITE_ADMIN_PASSWORD as string | undefined)?.trim() ?? ''

const SESSION_KEY = 'cnd-admin-session'
const SESSION_MS  = 8 * 60 * 60 * 1000   // 8 hours

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

let fails = 0
let lockedUntil = 0
export async function login(username: string, password: string): Promise<'ok' | 'invalid' | 'locked' | 'not-configured'> {
  if (!ADMIN_PASS) return 'not-configured'
  if (Date.now() < lockedUntil) return 'locked'
  const ok = username.trim().toLowerCase() === ADMIN_USER.toLowerCase() && password === ADMIN_PASS
  if (!ok) {
    fails++
    if (fails >= 5) { lockedUntil = Date.now() + 30_000; fails = 0 }
    return 'invalid'
  }
  fails = 0
  writeSession({ username: ADMIN_USER, name: ADMIN_USER, expires: Date.now() + SESSION_MS })
  return 'ok'
}
export const logout = () => writeSession(null)
