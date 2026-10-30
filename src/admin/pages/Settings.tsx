import { useEffect, useState } from 'react'
import { getAuthRecord, saveSettings, useStore } from '../../data/store'
import { createAdminUser, updateAdmin, useSession, verifyPassword } from '../auth'
import { Button, Card, Field, inputCls, PageHeader, useToast } from '../ui'

export default function SettingsPage() {
  const s = useStore()
  const session = useSession()
  const toast = useToast()

  // ── Profile (display name + username) ────────────────────────────────────
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')

  // ── Change password ───────────────────────────────────────────────────────
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })

  // ── Create new admin user ─────────────────────────────────────────────────
  const [nu, setNu] = useState({ username: '', password: '', confirm: '', name: '' })

  const [err, setErr] = useState<Record<string, string>>({})
  const n = s.settings.notifications

  useEffect(() => {
    getAuthRecord().then(r => {
      if (r) { setName(r.name); setUsername(r.email) }
    })
  }, [])

  const saveProfile = async () => {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = 'Display name is required'
    if (!username.trim()) e.username = 'Username is required'
    setErr(e)
    if (Object.keys(e).length) return
    await updateAdmin({ name: name.trim(), username: username.trim() })
    toast('success', 'Profile updated')
  }

  const savePassword = async () => {
    const e: Record<string, string> = {}
    if (!pw.current) e.pwCurrent = 'Enter your current password'
    else if (!(await verifyPassword(pw.current))) e.pwCurrent = 'Current password is incorrect'
    if (pw.next.length < 6) e.pwNext = 'Use at least 6 characters'
    if (pw.confirm !== pw.next) e.pwConfirm = 'Passwords do not match'
    setErr(e)
    if (Object.keys(e).length) return
    await updateAdmin({ newPassword: pw.next })
    setPw({ current: '', next: '', confirm: '' })
    toast('success', 'Password changed')
  }

  const createUser = async () => {
    const e: Record<string, string> = {}
    if (!nu.username.trim()) e.nuUsername = 'Username is required'
    if (nu.password.length < 6) e.nuPassword = 'Use at least 6 characters'
    if (nu.confirm !== nu.password) e.nuConfirm = 'Passwords do not match'
    setErr(e)
    if (Object.keys(e).length) return
    await createAdminUser(nu.username.trim(), nu.password, nu.name.trim() || nu.username.trim())
    setNu({ username: '', password: '', confirm: '', name: '' })
    toast('success', `User "${nu.username.trim()}" created — they can now log in`)
  }

  const toggle = (k: keyof typeof n) =>
    saveSettings({ ...s.settings, notifications: { ...n, [k]: !n[k] } }).then(() => toast('success', 'Preferences saved'))

  return (
    <>
      <PageHeader title="Settings" subtitle={`Signed in as ${session?.username ?? session?.name ?? ''}`} />
      <div className="grid lg:grid-cols-2 gap-5 max-w-5xl">

        {/* ── Profile ── */}
        <Card title="Admin profile">
          <div className="space-y-4">
            <Field label="Display name" error={err.name}>
              <input className={inputCls} value={name} autoComplete="name" onChange={e => setName(e.target.value)} />
            </Field>
            <Field label="Username" error={err.username}>
              <input className={inputCls} value={username} autoComplete="username" onChange={e => setUsername(e.target.value)} />
            </Field>
            <Button variant="primary" onClick={saveProfile}>Save profile</Button>
          </div>
        </Card>

        {/* ── Change password ── */}
        <Card title="Change password">
          <div className="space-y-4">
            <Field label="Current password" error={err.pwCurrent}>
              <input type="password" autoComplete="current-password" className={inputCls} value={pw.current} onChange={e => setPw({ ...pw, current: e.target.value })} />
            </Field>
            <Field label="New password" error={err.pwNext} hint="At least 6 characters.">
              <input type="password" autoComplete="new-password" className={inputCls} value={pw.next} onChange={e => setPw({ ...pw, next: e.target.value })} />
            </Field>
            <Field label="Confirm new password" error={err.pwConfirm}>
              <input type="password" autoComplete="new-password" className={inputCls} value={pw.confirm} onChange={e => setPw({ ...pw, confirm: e.target.value })} />
            </Field>
            <Button variant="primary" onClick={savePassword}>Update password</Button>
          </div>
        </Card>

        {/* ── Create new user ── */}
        <Card title="Create / replace admin user" className="lg:col-span-2">
          <p className="text-sm text-[#5B6B78] mb-4">Use this to set up a new login credential. This replaces the current admin account.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Username" error={err.nuUsername}>
              <input className={inputCls} value={nu.username} autoComplete="off" placeholder="e.g. cndadmin" onChange={e => setNu({ ...nu, username: e.target.value })} />
            </Field>
            <Field label="Display name (optional)">
              <input className={inputCls} value={nu.name} autoComplete="off" placeholder="e.g. CND Admin" onChange={e => setNu({ ...nu, name: e.target.value })} />
            </Field>
            <Field label="Password" error={err.nuPassword} hint="At least 6 characters.">
              <input type="password" autoComplete="new-password" className={inputCls} value={nu.password} onChange={e => setNu({ ...nu, password: e.target.value })} />
            </Field>
            <Field label="Confirm password" error={err.nuConfirm}>
              <input type="password" autoComplete="new-password" className={inputCls} value={nu.confirm} onChange={e => setNu({ ...nu, confirm: e.target.value })} />
            </Field>
          </div>
          <div className="mt-4">
            <Button variant="primary" onClick={createUser}>Create user</Button>
          </div>
        </Card>

        {/* ── Notifications ── */}
        <Card title="Notification preferences" className="lg:col-span-2">
          {([['newEnquiry', 'New quotation enquiries'], ['productChanges', 'Product change summaries'], ['weeklySummary', 'Weekly catalogue summary']] as const).map(([k, label]) => (
            <label key={k} className="flex items-center justify-between min-h-12 border-b last:border-0 border-[#EEF1F5] cursor-pointer text-sm">
              {label}
              <input type="checkbox" role="switch" className="w-5 h-5 accent-[#F2A71B]" checked={n[k]} onChange={() => toggle(k)} />
            </label>
          ))}
          <p className="text-[11px] text-[#7B8A99] mt-3">Preferences are stored now; email delivery activates once a server-side mailer is connected.</p>
        </Card>

      </div>
    </>
  )
}
