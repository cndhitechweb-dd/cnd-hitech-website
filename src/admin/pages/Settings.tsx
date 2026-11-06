import { useState } from 'react'
import { saveSettings, useStore } from '../../data/store'
import { testGitHubConnection } from '../../data/githubRepo'
import { useSession } from '../auth'
import { Button, Card, Icon, PageHeader, useToast } from '../ui'

export default function SettingsPage() {
  const s = useStore()
  const session = useSession()
  const toast = useToast()

  const [confirmCopy, setConfirmCopy] = useState(false)
  const [ghTesting, setGhTesting] = useState(false)
  const [ghStatus, setGhStatus] = useState<{ ok: boolean; error?: string } | null>(null)

  const n = s.settings.notifications

  const toggle = (k: keyof typeof n) =>
    saveSettings({ ...s.settings, notifications: { ...n, [k]: !n[k] } }).then(() => toast('success', 'Preferences saved'))

  const testConnection = async () => {
    setGhTesting(true)
    setGhStatus(null)
    const result = await testGitHubConnection()
    setGhStatus(result)
    setGhTesting(false)
    if (result.ok) {
      toast('success', 'GitHub connection is working! Saves will reach your repository.')
    } else {
      toast('error', `GitHub connection failed: ${result.error}`)
    }
  }

  return (
    <>
      <PageHeader title="Settings" subtitle={`Signed in as ${session?.username ?? session?.name ?? ''}`} />
      <div className="grid lg:grid-cols-2 gap-5 max-w-5xl">

        {/* ── GitHub backend status ── */}
        <Card title="GitHub backend" className="lg:col-span-2">
          <div className="space-y-3">
            <p className="text-sm text-[#5B6B78]">
              All product data and images are saved to your GitHub repo{' '}
              <strong>cndhitechweb-dd/cnd-hitech-website</strong> via a Vercel serverless function.
              The site auto-deploys within 1-3 minutes of any admin save.
            </p>
            <p className="text-sm text-[#5B6B78]">
              Requires <code className="bg-[#EEF1F5] px-1.5 py-0.5 rounded text-[#0E2A47]">GITHUB_TOKEN</code>{' '}
              to be set in Vercel → Settings → Environment Variables (not <code className="bg-[#EEF1F5] px-1.5 py-0.5 rounded text-[#0E2A47]">VITE_GITHUB_TOKEN</code>).
            </p>
            <div className="flex items-center gap-3 pt-1">
              <Button variant="secondary" onClick={testConnection} disabled={ghTesting}>
                {ghTesting ? 'Testing…' : 'Test GitHub Connection'}
              </Button>
              {ghStatus !== null && (
                <span className={`flex items-center gap-1.5 text-sm font-semibold ${ghStatus.ok ? 'text-green-600' : 'text-red-600'}`}>
                  <Icon name={ghStatus.ok ? 'check' : 'alert'} className="w-4 h-4" />
                  {ghStatus.ok ? 'Connected ✓' : `Failed: ${ghStatus.error}`}
                </span>
              )}
            </div>
            {ghStatus && !ghStatus.ok && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 space-y-1">
                <p><strong>Fix:</strong> Go to Vercel → cnd-hitech-website → Settings → Environment Variables</p>
                <p>Add <code>GITHUB_TOKEN</code> = your GitHub PAT (scope: <code>public_repo</code>)</p>
                <p>Make sure the name is exactly <strong>GITHUB_TOKEN</strong> (not VITE_GITHUB_TOKEN)</p>
                <p>After saving, click <strong>Redeploy</strong> in Vercel for the token to take effect.</p>
              </div>
            )}
          </div>
        </Card>

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
