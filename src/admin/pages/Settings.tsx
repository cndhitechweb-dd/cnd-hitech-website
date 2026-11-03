import { useState } from 'react'
import { saveSettings, useStore } from '../../data/store'
import { useSession } from '../auth'
import { Button, Card, Icon, PageHeader, useToast } from '../ui'

export default function SettingsPage() {
  const s = useStore()
  const session = useSession()
  const toast = useToast()

  const [confirmCopy, setConfirmCopy] = useState(false)

  const n = s.settings.notifications

  const toggle = (k: keyof typeof n) =>
    saveSettings({ ...s.settings, notifications: { ...n, [k]: !n[k] } }).then(() => toast('success', 'Preferences saved'))

  return (
    <>
      <PageHeader title="Settings" subtitle={`Signed in as ${session?.username ?? session?.name ?? ''}`} />
      <div className="grid lg:grid-cols-2 gap-5 max-w-5xl">

        {/* ── Credentials info ── */}
        <Card title="Admin credentials" className="lg:col-span-2">
          <div className="space-y-3">
            <p className="text-sm text-[#5B6B78]">
              Your login credentials (username &amp; password) are stored securely as{' '}
              <strong>Vercel Environment Variables</strong> — not in this browser.
              They work the same across every browser and device.
            </p>
            <p className="text-sm text-[#5B6B78]">
              To change your username or password:
            </p>
            <ol className="text-sm text-[#5B6B78] list-decimal list-inside space-y-1">
              <li>Go to <strong>Vercel Dashboard → cnd-hitech-website → Settings → Environment Variables</strong></li>
              <li>Update <code className="bg-[#EEF1F5] px-1.5 py-0.5 rounded text-[#0E2A47]">VITE_ADMIN_USERNAME</code> and/or <code className="bg-[#EEF1F5] px-1.5 py-0.5 rounded text-[#0E2A47]">VITE_ADMIN_PASSWORD</code></li>
              <li>Click <strong>Save</strong> then <strong>Redeploy</strong> the project</li>
            </ol>
            <div className="pt-1">
              <a
                href="https://vercel.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#D4920F] hover:underline"
              >
                <Icon name="external" className="w-4 h-4" />
                Open Vercel Dashboard
              </a>
            </div>
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
