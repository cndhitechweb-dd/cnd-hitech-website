import { useState } from 'react'
import { getAuthRecord, saveSettings, useStore } from '../../data/store'
import { updateAdmin, useSession, verifyPassword } from '../auth'
import { Button, Card, Field, inputCls, PageHeader, useToast } from '../ui'
import { useEffect } from 'react'

export default function SettingsPage() {
  const s = useStore()
  const session = useSession()
  const toast = useToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })
  const [err, setErr] = useState<Record<string, string>>({})
  const n = s.settings.notifications

  useEffect(() => { getAuthRecord().then(r => { if (r) { setName(r.name); setEmail(r.email) } }) }, [])

  const saveProfile = async () => {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = 'Name is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email'
    setErr(e)
    if (Object.keys(e).length) return
    await updateAdmin({ name: name.trim(), email })
    toast('success', 'Profile updated')
  }
  const savePassword = async () => {
    const e: Record<string, string> = {}
    if (!pw.current) e.current = 'Enter your current password'
    else if (!(await verifyPassword(pw.current))) e.current = 'Current password is incorrect'
    if (pw.next.length < 10) e.next = 'Use at least 10 characters'
    if (pw.confirm !== pw.next) e.confirm = 'Passwords do not match'
    setErr(e)
    if (Object.keys(e).length) return
    await updateAdmin({ newPassword: pw.next })
    setPw({ current: '', next: '', confirm: '' })
    toast('success', 'Password changed')
  }
  const toggle = (k: keyof typeof n) => saveSettings({ ...s.settings, notifications: { ...n, [k]: !n[k] } }).then(() => toast('success', 'Preferences saved'))

  return (
    <>
      <PageHeader title="Settings" subtitle={`Signed in as ${session?.email ?? ''}`} />
      <div className="grid lg:grid-cols-2 gap-5 max-w-5xl">
        <Card title="Admin profile">
          <div className="space-y-4">
            <Field label="Name" error={err.name}><input className={inputCls} value={name} onChange={e => setName(e.target.value)} /></Field>
            <Field label="Email" error={err.email}><input type="email" className={inputCls} value={email} onChange={e => setEmail(e.target.value)} /></Field>
            <Button variant="primary" onClick={saveProfile}>Save profile</Button>
          </div>
        </Card>
        <Card title="Change password">
          <div className="space-y-4">
            <Field label="Current password" error={err.current}><input type="password" autoComplete="current-password" className={inputCls} value={pw.current} onChange={e => setPw({ ...pw, current: e.target.value })} /></Field>
            <Field label="New password" error={err.next} hint="At least 10 characters."><input type="password" autoComplete="new-password" className={inputCls} value={pw.next} onChange={e => setPw({ ...pw, next: e.target.value })} /></Field>
            <Field label="Confirm new password" error={err.confirm}><input type="password" autoComplete="new-password" className={inputCls} value={pw.confirm} onChange={e => setPw({ ...pw, confirm: e.target.value })} /></Field>
            <Button variant="primary" onClick={savePassword}>Update password</Button>
          </div>
        </Card>
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
