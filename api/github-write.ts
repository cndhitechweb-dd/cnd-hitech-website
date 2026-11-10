// Vercel serverless function — runs SERVER-SIDE only.
// The GITHUB_TOKEN is never exposed to the browser.
// Add GITHUB_TOKEN to Vercel → Settings → Environment Variables.
// Required scope: public_repo (classic PAT) or contents:write (fine-grained PAT).

const REPO   = 'cndhitechweb-dd/cnd-hitech-website'
const BRANCH = 'main'

export default async function handler(req: Request): Promise<Response> {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const token = process.env.GITHUB_TOKEN
  if (!token) {
    return Response.json(
      { error: 'GITHUB_TOKEN is not set. Add it in Vercel → Project → Settings → Environment Variables.' },
      { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
    )
  }

  let body: { path?: string; content?: string; message?: string }
  try {
    body = await req.json() as { path?: string; content?: string; message?: string }
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { path, content, message } = body
  if (!path || content === undefined) {
    return Response.json({ error: 'path and content are required' }, { status: 400 })
  }

  const apiUrl = `https://api.github.com/repos/${REPO}/contents/${path}`
  const headers: Record<string, string> = {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
    'User-Agent': 'cnd-hitech-admin/1.0',
  }

  // Fetch existing file SHA (required by GitHub API when updating an existing file)
  // Retry up to 2 times in case of transient failures
  let sha: string | undefined
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const r = await fetch(`${apiUrl}?ref=${BRANCH}`, { headers })
      if (r.ok) {
        const fileData = await r.json() as { sha?: string }
        if (fileData && typeof fileData.sha === 'string') {
          sha = fileData.sha
        }
        break
      } else if (r.status === 404) {
        // New file — no SHA needed
        break
      }
    } catch { /* ignore, retry */ }
  }

  const cors = { 'Access-Control-Allow-Origin': '*' }

  // Commit file to GitHub
  const writeRes = await fetch(apiUrl, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      message: message ?? `Update ${path}`,
      content,
      sha,
      branch: BRANCH,
    }),
  })

  if (!writeRes.ok) {
    const errText = await writeRes.text()
    let errMsg = 'GitHub write failed'
    try { errMsg = (JSON.parse(errText) as { message?: string }).message ?? errMsg } catch { /* use default */ }

    // If SHA conflict (422), retry once with fresh SHA
    if (writeRes.status === 422 || writeRes.status === 409) {
      try {
        const r2 = await fetch(`${apiUrl}?ref=${BRANCH}`, { headers })
        if (r2.ok) {
          const fd = await r2.json() as { sha?: string }
          if (fd && typeof fd.sha === 'string') {
            const retry = await fetch(apiUrl, {
              method: 'PUT',
              headers,
              body: JSON.stringify({
                message: message ?? `Update ${path}`,
                content,
                sha: fd.sha,
                branch: BRANCH,
              }),
            })
            if (retry.ok) {
              const retryData = await retry.json() as { content?: { download_url?: string } }
              return Response.json({ url: retryData.content?.download_url ?? null }, { headers: cors })
            }
            const retryErr = await retry.text()
            try { errMsg = (JSON.parse(retryErr) as { message?: string }).message ?? errMsg } catch { /* use default */ }
          }
        }
      } catch { /* fall through to original error */ }
    }

    return Response.json(
      { error: errMsg },
      { status: writeRes.status, headers: cors }
    )
  }

  const data = await writeRes.json() as { content?: { download_url?: string } }
  return Response.json({ url: data.content?.download_url ?? null }, { headers: cors })
}

export const config = { runtime: 'edge' }
