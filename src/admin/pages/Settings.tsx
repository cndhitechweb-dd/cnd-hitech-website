import { useEffect, useState } from 'react'
import { getAuthRecord, saveSettings, useStore } from '../../data/store'
import { createAdminUser, deleteAdmin, hasRecoveryCode, setRecoveryCode, updateAdmin, useSession, verifyPassword } from '../auth'
import { Button, Card, Field, Icon, inputCls, PageHeader, useToast } from '../ui'

export default function SettingsPage() {
  const s = useStore()
  const session = useSession()
  const toast = useToast()

  // ── Profile ───────────────────────────────────────────────────────────────
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')

  // ── Change password ───────────────────────────────────────────────────────
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false })

  // ── Change login credentials (username + password together) ───────────────
  const [cred, setCred] = useState({ username: '', password: '', confirm: '' })
  const [showCred, setShowCred] = useState({ password: false, confirm: false })

  // ── Recovery code ─────────────────────────────────────────────────────────
  const [recovery, setRecovery] = useState('')
  const [recoverySet, setRecoverySet] = useState(false)
  useEffect(() => { hasRecoveryCode().then(setRecoverySet) }, [])

  // ── Delete account ────────────────────────────────────────────────────────
  const [confirmDelete, setConfirmDelete] = useState(false)

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

  const saveCredentials = async () => {
    const e: Record<string, string> = {}
    if (!cred.username.trim()) e.credUsername = 'Username is required'
    if (cred.password.length < 6) e.credPassword = 'Use at least 6 characters'
    if (cred.confirm !== cred.password) e.credConfirm = 'Passwords do not match'
    setErr(e)
    if (Object.keys(e).length) return
    await createAdminUser(cred.username.trim(), cred.password, name || cred.username.trim())
    setUsername(cred.username.trim())
    setCred({ username: '', password: '', confirm: '' })
    toast('success', 'Login credentials updated — use the new username & password next time you log in')
  }

  const saveRecovery = async () => {
    if (!recovery.trim()) { setErr({ recovery: 'Enter a recovery phrase or word' }); return }
    await setRecoveryCode(recovery.trim())
    setRecovery('')
    setRecoverySet(true)
    toast('success', 'Recovery code saved — keep it somewhere safe!')
  }

  const toggle = (k: keyof typeof n) =>
    saveSettings({ ...s.settings, notifications: { ...n, [k]: !n[k] } }).then(() => toast('success', 'Preferences saved'))

  const eyeBtn = (show: boolean, onToggle: () => void) => (
    <button
      type="button"
      aria-label={show ? 'Hide password' : 'Show password'}
      onClick={onToggle}
      className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-[#7B8A99] hover:text-[#0E2A47]"
    >
      <Icon name={show ? 'eyeOff' : 'eye'} className="w-[18px] h-[18px]" />
    </button>
  )

  return (
    <>
      <PageHeader title="Settings" subtitle={`Signed in as ${session?.username ?? session?.name ?? ''}`} />
      <div className="grid lg:grid-cols-2 gap-5 max-w-5xl">

        {/* ── Display name ── */}
        <Card title="Admin profile">
          <div className="space-y-4">
            <Field label="Display name" error={err.name}>
              <input className={inputCls} value={name} autoComplete="name" onChange={e => setName(e.target.value)} />
            </Field>
            <Field label="Current username" error={err.username} hint="This is what you type to log in.">
              <input className={inputCls} value={username} autoComplete="username" onChange={e => setUsername(e.target.value)} />
            </Field>
            <Button variant="primary" onClick={saveProfile}>Save profile</Button>
          </div>
        </Card>

        {/* ── Change password ── */}
        <Card title="Change password">
          <div className="space-y-4">
            <Field label="Current password" error={err.pwCurrent}>
              <div className="relative">
                <input type={showPw.current ? 'text' : 'password'} autoComplete="current-password" className={`${inputCls} pr-11`} value={pw.current} onChange={e => setPw({ ...pw, current: e.target.value })} />
                {eyeBtn(showPw.current, () => setShowPw(p => ({ ...p, current: !p.current })))}
              </div>
            </Field>
            <Field label="New password" error={err.pwNext} hint="At least 6 characters.">
              <div className="relative">
                <input type={showPw.next ? 'text' : 'password'} autoComplete="new-password" className={`${inputCls} pr-11`} value={pw.next} onChange={e => setPw({ ...pw, next: e.target.value })} />
                {eyeBtn(showPw.next, () => setShowPw(p => ({ ...p, next: !p.next })))}
              </div>
            </Field>
            <Field label="Confirm new password" error={err.pwConfirm}>
              <div className="relative">
                <input type={showPw.confirm ? 'text' : 'password'} autoComplete="new-password" className={`${inputCls} pr-11`} value={pw.confirm} onChange={e => setPw({ ...pw, confirm: e.target.value })} />
                {eyeBtn(showPw.confirm, () => setShowPw(p => ({ ...p, confirm: !p.confirm })))}
              </div>
            </Field>
            <Button variant="primary" onClick={savePassword}>Update password</Button>
          </div>
        </Card>

        {/* ── Change login credentials ── */}
        <Card title="Change login credentials" className="lg:col-span-2">
          <p className="text-sm text-[#5B6B78] mb-4">
            Set a new username and password for logging into the admin panel. After saving, use the new credentials on the next login.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="New username" error={err.credUsername}>
              <input className={inputCls} value={cred.username} autoComplete="off" placeholder="e.g. cndadmin" onChange={e => setCred({ ...cred, username: e.target.value })} />
            </Field>
            <Field label="New password" error={err.credPassword} hint="At least 6 characters.">
              <div className="relative">
                <input type={showCred.password ? 'text' : 'password'} autoComplete="new-password" className={`${inputCls} pr-11`} value={cred.password} onChange={e => setCred({ ...cred, password: e.target.value })} />
                {eyeBtn(showCred.password, () => setShowCred(p => ({ ...p, password: !p.password })))}
              </div>
            </Field>
            <Field label="Confirm password" error={err.credConfirm}>
              <div className="relative">
                <input type={showCred.confirm ? 'text' : 'password'} autoComplete="new-password" className={`${inputCls} pr-11`} value={cred.confirm} onChange={e => setCred({ ...cred, confirm: e.target.value })} />
                {eyeBtn(showCred.confirm, () => setShowCred(p => ({ ...p, confirm: !p.confirm })))}
              </div>
            </Field>
          </div>
          <div className="mt-4">
            <Button variant="primary" onClick={saveCredentials}>Save credentials</Button>
          </div>
        </Card>

        {/* ── Recovery code ── */}
        <Card title="Forgot password recovery code" className="lg:col-span-2">
          <p className="text-sm text-[#5B6B78] mb-4">
            Set a secret word or phrase. If you forget your password, you'll need to enter this code to reset it.
            {recoverySet && <span className="ml-2 text-[#1B5E20] font-medium">✓ Recovery code is set.</span>}
          </p>
          <div className="flex gap-3 items-end max-w-md">
            <Field label={recoverySet ? 'Update recovery code' : 'Set recovery code'} error={err.recovery} className="flex-1">
              <input
                className={inputCls}
                type="password"
                value={recovery}
                autoComplete="off"
                placeholder="e.g. a secret word only you know"
                onChange={e => setRecovery(e.target.value)}
              />
            </Field>
            <Button variant="primary" onClick={saveRecovery} className="mb-0.5">Save</Button>
          </div>
        </Card>

        {/* ── Notifications ── */}
        <Card title="Notification preferences" className="lg:col-span-2">          {([['newEnquiry', 'New quotation enquiries'], ['productChanges', 'Product change summaries'], ['weeklySummary', 'Weekly catalogue summary']] as const).map(([k, label]) => (
            <label key={k} className="flex items-center justify-between min-h-12 border-b last:border-0 border-[#EEF1F5] cursor-pointer text-sm">
              {label}
              <input type="checkbox" role="switch" className="w-5 h-5 accent-[#F2A71B]" checked={n[k]} onChange={() => toggle(k)} />
            </label>
          ))}
          <p className="text-[11px] text-[#7B8A99] mt-3">Preferences are stored now; email delivery activates once a server-side mailer is connected.</p>
        </Card>

        {/* ── Danger zone ── */}
        <Card title="Danger zone" className="lg:col-span-2">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm font-medium text-[#0E2A47]">Delete admin account</p>
              <p className="text-sm text-[#5B6B78] mt-0.5">
                Removes the current login credentials. You will be logged out immediately.
                The default login (<strong>admin / cndadmin2024</strong>) will be restored on next page load.
              </p>
            </div>
            {!confirmDelete ? (
              <Button variant="danger" onClick={() => setConfirmDelete(true)}>Delete account</Button>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#C62828] font-medium">Are you sure?</span>
                <Button variant="danger" onClick={async () => { await deleteAdmin(); window.location.href = '/admin/login' }}>Yes, delete</Button>
                <Button onClick={() => setConfirmDelete(false)}>Cancel</Button>
              </div>
            )}
          </div>
        </Card>

      </div>
    </>
  )
}
