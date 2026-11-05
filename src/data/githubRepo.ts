import type { Repository, StoreState } from './store'

const OWNER  = 'cndhitechweb-dd'
const REPO   = 'cnd-hitech-website'
const BRANCH = 'main'
const RAW    = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}`

const STATE_PATH = 'public/data/state.json'

/* ── Helpers ──────────────────────────────────────────────────────────────── */

/** UTF-8 safe base64 encoding (handles emoji, Tamil text, etc.) */
function toBase64(text: string): string {
  const bytes = new TextEncoder().encode(text)
  const binary = Array.from(bytes, b => String.fromCharCode(b)).join('')
  return btoa(binary)
}

/** Convert a Blob to base64 string (for images/PDFs). */
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload  = () => resolve((reader.result as string).split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

function fileExt(blob: Blob): string {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg', 'image/jpg': 'jpg',
    'image/png': 'png',  'image/webp': 'webp',
    'application/pdf': 'pdf',
  }
  return map[blob.type] ?? 'bin'
}

/** POST to our Vercel serverless function which does the actual GitHub write. */
async function githubWrite(path: string, content: string, message: string): Promise<{ url: string | null }> {
  const res = await fetch('/api/github-write', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path, content, message }),
  })
  if (!res.ok) {
    const err = await res.json() as { error?: string }
    throw new Error(err.error ?? 'GitHub write failed')
  }
  return res.json()
}

/* ── Repository ───────────────────────────────────────────────────────────── */

export const githubRepo: Repository = {

  /* State ------------------------------------------------------------------ */

  async loadState() {
    try {
      // Add cache-busting param so we always get the latest committed version
      const res = await fetch(`${RAW}/${STATE_PATH}?t=${Date.now()}`, { cache: 'no-store' })
      if (!res.ok) return null
      return (await res.json()) as StoreState
    } catch {
      return null
    }
  },

  async saveState(state) {
    try {
      const content = toBase64(JSON.stringify(state))
      await githubWrite(STATE_PATH, content, 'Update product catalogue [admin]')
    } catch (e) {
      console.error('[GitHub] saveState failed:', e)
      // Don't throw — keep the in-memory state working even if persist fails
    }
  },

  /* Files (images / PDFs) -------------------------------------------------- */

  async putFile(id, blob) {
    const ext  = fileExt(blob)
    const path = `public/images/${id}.${ext}`
    const content = await blobToBase64(blob)
    const data = await githubWrite(path, content, `Upload ${ext} ${id} [admin]`)
    // GitHub returns the raw URL immediately — image is accessible right away
    return data.url ?? `${RAW}/${path}`
  },

  async deleteFile(_id) {
    // GitHub deletion requires the file SHA via a separate GET.
    // Skipped for now — orphan files are harmless in a public images folder.
  },

  async loadFiles() {
    // All file refs are direct HTTPS URLs stored in state.json.
    // No blob loading needed.
    return new Map()
  },

  /* Auth (handled by Vercel env vars — not stored in GitHub) --------------- */
  getAuth:    async () => null,
  setAuth:    async () => {},
  deleteAuth: async () => {},

  /* Cross-tab / cross-device sync ------------------------------------------ */
  subscribeExternal(_cb) {
    // GitHub has no real-time push. Changes propagate after Vercel redeploys.
    // For the admin panel, state is managed in-memory — no polling needed.
    return () => {}
  },

  notifyExternal() {},
}

