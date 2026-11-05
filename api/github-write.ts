/**
 * Vercel serverless function — runs SERVER-SIDE only.
 * The GITHUB_TOKEN is never exposed to the browser.
 *
 * Add GITHUB_TOKEN to Vercel → Settings → Environment Variables.
 * Required scope: public_repo (classic PAT) or contents:write (fine-grained PAT).
 */

export const config = {
  api: { bodyParser: { sizeLimit: '15mb' } },
}

const REPO  = 'cndhitechweb-dd/cnd-hitech-website'
const BRANCH = 'main'

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') { res.status(200).end(); return }
  if (req.method !== 'POST')   { res.status(405).end(); return }

  const token = process.env.GITHUB_TOKEN
  if (!token) {
    res.status(500).json({ error: 'GITHUB_TOKEN is not set in Vercel environment variables. Add it at vercel.com → Project → Settings → Environment Variables.' })
    return
  }

  const { path, content, message } = req.body as { path: string; content: string; message?: string }
  if (!path || content === undefined) {
    res.status(400).json({ error: 'path and content are required' })
    return
  }

  const apiUrl = `https://api.github.com/repos/${REPO}/contents/${path}`
  const headers: Record<string, string> = {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
    'User-Agent': 'cnd-hitech-admin/1.0',
  }

  // Fetch existing file SHA (required by GitHub API when updating an existing file)
  let sha: string | undefined
  try {
    const r = await fetch(`${apiUrl}?ref=${BRANCH}`, { headers })
    if (r.ok) sha = ((await r.json()) as any).sha
  } catch { /* new file — no SHA needed */ }

  // Commit file to GitHub
  const writeRes = await fetch(apiUrl, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      message: message ?? `Update ${path}`,
      content,  // base64-encoded file content
      sha,      // undefined for new files
      branch: BRANCH,
    }),
  })

  if (!writeRes.ok) {
    const err = (await writeRes.json()) as any
    res.status(writeRes.status).json({ error: err.message ?? 'GitHub write failed' })
    return
  }

  const data = (await writeRes.json()) as any
  res.json({ url: data.content?.download_url ?? null })
}

