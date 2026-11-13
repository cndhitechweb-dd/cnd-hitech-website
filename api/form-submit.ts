// Vercel Node.js Serverless Function (NOT edge — needs TCP for Gmail SMTP)
// Sends email via Gmail SMTP when a form is submitted.
//
// Required env vars in Vercel → Project → Settings → Environment Variables:
//   GITHUB_TOKEN        — GitHub PAT (contents:write + issues:write)
//   GMAIL_USER          — cndhitech.web@gmail.com  (SMTP login — web account)
//   GMAIL_APP_PASSWORD  — 16-char Gmail App Password for cndhitech.web@gmail.com
//
// Gmail App Password setup (one-time, for cndhitech.web@gmail.com):
//   1. Go to myaccount.google.com → Security  (sign in as cndhitech.web@gmail.com)
//   2. Turn ON 2-Step Verification (if not already)
//   3. Search "App passwords" → App name: "CND Website" → Create
//   4. Copy the 16-character password → paste in Vercel env var GMAIL_APP_PASSWORD

import nodemailer from 'nodemailer'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const REPO   = 'cndhitechweb-dd/cnd-hitech-website'
const BRANCH = 'main'
const FILE   = 'public/data/submissions.json'

// Primary recipient = web account (SMTP sender); CC = client's main account
const TO_EMAIL  = 'cndhitech.web@gmail.com'    // primary — SMTP login account
const CC_EMAIL  = 'cndhitech.india@gmail.com'  // client gets CC (no credentials needed)

export interface Submission {
  id: string
  type: 'rfq' | 'quotation' | 'enquiry'
  submittedAt: string
  status: 'new' | 'read' | 'replied'
  name: string
  surname: string
  email: string
  phone: string
  department: string
  companyName: string
  companyType: string
  state: string
  city: string
  inquiry: string
  product?: string
  industry?: string
  products?: string[]
}

const TYPE_LABEL: Record<string, string> = {
  rfq: 'RFQ / Contact Form',
  quotation: 'Quotation Request',
  enquiry: 'Enquiry Cart',
}

function buildEmailHtml(s: Submission): string {
  const rows = [
    ['Name',         `${s.name} ${s.surname}`],
    ['Email',        `<a href="mailto:${s.email}" style="color:#F2A71B;">${s.email}</a>`],
    ['Phone',        `<a href="tel:${s.phone}" style="color:#F2A71B;">${s.phone}</a>`],
    ['Company',      s.companyName],
    ['Company Type', s.companyType],
    ['Department',   s.department],
    ['Location',     [s.city, s.state].filter(Boolean).join(', ')],
    ['Product',      s.product ?? ''],
    ['Industry',     s.industry ?? ''],
  ].filter(r => r[1])

  const productRows = s.products && s.products.length > 0
    ? `<tr><td colspan="2" style="padding:12px 0 4px;font-size:11px;font-weight:700;color:#8A9AA5;letter-spacing:1px;text-transform:uppercase;border-top:1px solid #F0F4F8;">Products Enquired</td></tr>
       ${s.products.map(p => `<tr><td colspan="2" style="padding:3px 0 3px 12px;font-size:14px;color:#334155;">• ${p}</td></tr>`).join('')}`
    : ''

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F7F8FA;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F8FA;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <!-- Header -->
  <tr><td style="background:#0E2A47;border-radius:12px 12px 0 0;padding:28px 32px;">
    <p style="margin:0;font-size:11px;font-weight:700;color:#F2A71B;letter-spacing:2px;text-transform:uppercase;">CND HI-TECH CO.</p>
    <h1 style="margin:8px 0 4px;font-size:22px;color:#ffffff;">New ${TYPE_LABEL[s.type] ?? s.type}</h1>
    <p style="margin:0;font-size:12px;color:#8DA5BE;">
      Received: ${new Date(s.submittedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })} IST
    </p>
  </td></tr>

  <!-- Body -->
  <tr><td style="background:#ffffff;padding:28px 32px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td colspan="2" style="padding-bottom:8px;font-size:11px;font-weight:700;color:#8A9AA5;letter-spacing:1px;text-transform:uppercase;">Contact Details</td></tr>
      ${rows.map(([label, value]) => `
      <tr>
        <td style="padding:6px 0;width:38%;font-size:13px;font-weight:600;color:#0E2A47;vertical-align:top;">${label}</td>
        <td style="padding:6px 0;font-size:14px;color:#334155;vertical-align:top;">${value}</td>
      </tr>`).join('')}
      ${productRows}
    </table>

    <!-- Inquiry -->
    <div style="margin-top:20px;background:#F7F8FA;border-left:4px solid #F2A71B;border-radius:0 8px 8px 0;padding:16px 20px;">
      <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#8A9AA5;letter-spacing:1px;text-transform:uppercase;">Inquiry / Message</p>
      <p style="margin:0;font-size:14px;color:#334155;line-height:1.7;white-space:pre-wrap;">${s.inquiry.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
    </div>

    <!-- Reply buttons -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
      <tr>
        <td style="padding-right:8px;">
          <a href="mailto:${s.email}?subject=Re: Your Enquiry - CND Hi-Tech Co."
             style="display:block;text-align:center;background:#F2A71B;color:#0E2A47;font-weight:700;font-size:13px;text-decoration:none;padding:12px 20px;border-radius:8px;">
            📧 Reply via Email
          </a>
        </td>
        <td style="padding-left:8px;">
          <a href="https://wa.me/${s.phone.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(s.name)}%2C%20this%20is%20CND%20Hi-Tech%20Co.%20regarding%20your%20enquiry."
             style="display:block;text-align:center;background:#25D366;color:#ffffff;font-weight:700;font-size:13px;text-decoration:none;padding:12px 20px;border-radius:8px;">
            💬 WhatsApp
          </a>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#F0F4F8;border-radius:0 0 12px 12px;padding:16px 32px;text-align:center;">
    <p style="margin:0;font-size:11px;color:#8DA5BE;">
      CND Hi-Tech Co. · Chennai ·
      <a href="https://cnd-hitech-website.vercel.app/admin/submissions" style="color:#F2A71B;text-decoration:none;">View in Admin Panel</a>
    </p>
    <p style="margin:4px 0 0;font-size:10px;color:#C8D8E8;">Submission ID: ${s.id}</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`
}

function buildEmailText(s: Submission): string {
  const lines = [
    `NEW ${(TYPE_LABEL[s.type] ?? s.type).toUpperCase()} — CND HI-TECH CO.`,
    `Received: ${new Date(s.submittedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`,
    '',
    'CONTACT DETAILS',
    `Name:         ${s.name} ${s.surname}`,
    `Email:        ${s.email}`,
    `Phone:        ${s.phone}`,
    s.companyName ? `Company:      ${s.companyName}`  : '',
    s.companyType ? `Company Type: ${s.companyType}`  : '',
    s.department  ? `Department:   ${s.department}`   : '',
    (s.city || s.state) ? `Location: ${[s.city, s.state].filter(Boolean).join(', ')}` : '',
    s.product     ? `Product:      ${s.product}`      : '',
    s.industry    ? `Industry:     ${s.industry}`     : '',
    '',
  ].filter(l => l !== undefined)

  if (s.products?.length) {
    lines.push('PRODUCTS:')
    s.products.forEach(p => lines.push(`  • ${p}`))
    lines.push('')
  }

  lines.push('INQUIRY:', s.inquiry, '', `Submission ID: ${s.id}`)
  return lines.join('\n')
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const token          = process.env.GITHUB_TOKEN
  const gmailUser      = process.env.GMAIL_USER          // cndhitech.web@gmail.com (SMTP login)
  const gmailPassword  = process.env.GMAIL_APP_PASSWORD  // App Password for cndhitech.web@gmail.com

  if (!token) return res.status(500).json({ error: 'Server configuration error.' })

  const body = req.body as Partial<Submission>
  if (!body?.name || !body.email || !body.phone || !body.inquiry) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const newEntry: Submission = {
    id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    submittedAt: new Date().toISOString(),
    status: 'new',
    type: body.type ?? 'rfq',
    name: body.name,
    surname: body.surname ?? '',
    email: body.email,
    phone: body.phone,
    department: body.department ?? '',
    companyName: body.companyName ?? '',
    companyType: body.companyType ?? '',
    state: body.state ?? '',
    city: body.city ?? '',
    inquiry: body.inquiry,
    product: body.product,
    industry: body.industry,
    products: body.products,
  }

  // ── 1. Send Email via Gmail SMTP ──────────────────────────────────────────
  if (gmailUser && gmailPassword) {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: { user: gmailUser, pass: gmailPassword },
      })

      await transporter.sendMail({
        from: `"${newEntry.name} ${newEntry.surname} via CND Website" <${gmailUser}>`,
        to: TO_EMAIL,
        cc: CC_EMAIL,
        replyTo: newEntry.email,
        subject: `[${newEntry.type.toUpperCase()}] ${newEntry.name} ${newEntry.surname} <${newEntry.email}>${newEntry.companyName ? ` — ${newEntry.companyName}` : ''}`,
        html: buildEmailHtml(newEntry),
        text: buildEmailText(newEntry),
      })
    } catch (err) {
      console.error('Gmail SMTP error:', err)
      // Don't fail the whole request — still save to GitHub
    }
  }

  const ghHeaders: Record<string, string> = {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
    'User-Agent': 'cnd-hitech-admin/1.0',
  }

  // ── 2. Create GitHub Issue (backup notification) ──────────────────────────
  try {
    await fetch(`https://api.github.com/repos/${REPO}/issues`, {
      method: 'POST',
      headers: ghHeaders,
      body: JSON.stringify({
        title: `[${newEntry.type.toUpperCase()}] ${newEntry.name} ${newEntry.surname}${newEntry.companyName ? ` — ${newEntry.companyName}` : ''}`,
        body: buildEmailText(newEntry),
        labels: ['enquiry'],
      }),
    })
  } catch { /* ignore */ }

  // ── 3. Save to submissions.json ───────────────────────────────────────────
  const apiUrl = `https://api.github.com/repos/${REPO}/contents/${FILE}`
  let currentSubmissions: Submission[] = []
  let sha: string | undefined

  try {
    const getRes = await fetch(`${apiUrl}?ref=${BRANCH}`, { headers: ghHeaders })
    if (getRes.ok) {
      const fileData = await getRes.json() as { sha: string; content: string }
      sha = fileData.sha
      try {
        const decoded = Buffer.from(fileData.content.replace(/\n/g, ''), 'base64').toString('utf-8')
        const parsed = JSON.parse(decoded) as Submission[]
        if (Array.isArray(parsed)) currentSubmissions = parsed
      } catch { currentSubmissions = [] }
    }
  } catch { /* treat as empty */ }

  currentSubmissions.push(newEntry)
  const updatedContent = Buffer.from(JSON.stringify(currentSubmissions, null, 2), 'utf-8').toString('base64')
  const writeBody: Record<string, unknown> = {
    message: `New ${newEntry.type} from ${newEntry.name} ${newEntry.surname}`,
    content: updatedContent,
    branch: BRANCH,
  }
  if (sha) writeBody.sha = sha

  let writeRes = await fetch(apiUrl, {
    method: 'PUT',
    headers: ghHeaders,
    body: JSON.stringify(writeBody),
  })

  // SHA conflict — retry
  if (writeRes.status === 422 || writeRes.status === 409) {
    try {
      const r2 = await fetch(`${apiUrl}?ref=${BRANCH}`, { headers: ghHeaders })
      if (r2.ok) {
        const fd = await r2.json() as { sha: string; content: string }
        const decoded = Buffer.from(fd.content.replace(/\n/g, ''), 'base64').toString('utf-8')
        const latest = JSON.parse(decoded) as Submission[]
        if (Array.isArray(latest) && !latest.find(s => s.id === newEntry.id)) {
          latest.push(newEntry)
          const retryContent = Buffer.from(JSON.stringify(latest, null, 2), 'utf-8').toString('base64')
          writeRes = await fetch(apiUrl, {
            method: 'PUT',
            headers: ghHeaders,
            body: JSON.stringify({ ...writeBody, content: retryContent, sha: fd.sha }),
          })
        }
      }
    } catch { /* fall through */ }
  }

  return res.status(200).json({ success: true, id: newEntry.id })
}
