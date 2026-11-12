import { useState, useEffect } from 'react'

interface Submission {
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
  rfq: 'RFQ / Contact',
  quotation: 'Quotation',
  enquiry: 'Enquiry Cart',
}

const STATUS_COLOR: Record<string, string> = {
  new: 'bg-[#F2A71B]/15 text-[#B87A00] border-[#F2A71B]/30',
  read: 'bg-blue-50 text-blue-700 border-blue-200',
  replied: 'bg-green-50 text-green-700 border-green-200',
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch { return iso }
}

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState<Submission | null>(null)
  const [filter, setFilter] = useState<'all' | 'new' | 'read' | 'replied'>('all')
  const [updating, setUpdating] = useState(false)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(
        `https://raw.githubusercontent.com/cndhitechweb-dd/cnd-hitech-website/main/public/data/submissions.json?t=${Date.now()}`
      )
      if (!res.ok) { setSubmissions([]); return }
      const data = await res.json() as Submission[]
      setSubmissions(Array.isArray(data) ? data.slice().reverse() : [])
    } catch {
      setError('Failed to load submissions.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void load() }, [])

  const updateStatus = async (id: string, newStatus: Submission['status']) => {
    setUpdating(true)
    try {
      const updated = submissions.map(s => s.id === id ? { ...s, status: newStatus } : s)
      const content = btoa(unescape(encodeURIComponent(JSON.stringify(updated.slice().reverse(), null, 2))))
      const res = await fetch('/api/github-write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: 'public/data/submissions.json',
          content,
          message: `Mark submission ${id} as ${newStatus}`,
        }),
      })
      if (res.ok) {
        setSubmissions(updated)
        if (selected?.id === id) setSelected(prev => prev ? { ...prev, status: newStatus } : null)
      }
    } catch { /* ignore */ }
    setUpdating(false)
  }

  const filtered = submissions.filter(s => filter === 'all' || s.status === filter)
  const newCount = submissions.filter(s => s.status === 'new').length

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-display font-bold text-[#0E2A47] text-2xl">Form Submissions</h1>
          <p className="text-[#5B6B78] text-sm mt-0.5">
            {newCount > 0
              ? <span className="text-[#E53935] font-semibold">{newCount} new unread</span>
              : 'All caught up!'} — {submissions.length} total
          </p>
        </div>
        <button
          onClick={load}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0E2A47] text-white text-sm font-semibold rounded-lg hover:bg-[#163A5F] transition-colors"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {(['all', 'new', 'read', 'replied'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize border transition-colors ${
              filter === f
                ? 'bg-[#0E2A47] text-white border-[#0E2A47]'
                : 'bg-white text-[#5B6B78] border-gray-200 hover:border-[#0E2A47]'
            }`}
          >
            {f}{f === 'new' && newCount > 0 ? ` (${newCount})` : ''}
          </button>
        ))}
      </div>

      {loading && (
        <div className="text-center py-16 text-[#8DA5BE] text-sm">Loading submissions…</div>
      )}

      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-16 text-center text-[#8DA5BE] text-sm">
          No submissions found.
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid lg:grid-cols-5 gap-6">
          {/* List */}
          <div className="lg:col-span-2 space-y-2">
            {filtered.map(s => (
              <button
                key={s.id}
                onClick={() => setSelected(s)}
                className={`w-full text-left bg-white rounded-xl border p-4 transition-all hover:shadow-sm ${
                  selected?.id === s.id ? 'border-[#F2A71B] shadow-sm' : 'border-gray-100'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="font-semibold text-[#0E2A47] text-sm truncate">
                    {s.name} {s.surname}
                    {s.status === 'new' && (
                      <span className="ml-2 inline-block w-2 h-2 rounded-full bg-[#F2A71B] align-middle" />
                    )}
                  </span>
                  <span className={`flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded border capitalize ${STATUS_COLOR[s.status]}`}>
                    {s.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[#8DA5BE]">
                  <span className="bg-[#F7F8FA] px-2 py-0.5 rounded">{TYPE_LABEL[s.type] ?? s.type}</span>
                  <span>·</span>
                  <span>{formatDate(s.submittedAt)}</span>
                </div>
                {s.companyName && (
                  <p className="text-[11px] text-[#5B6B78] mt-1 truncate">{s.companyName}</p>
                )}
              </button>
            ))}
          </div>

          {/* Detail view */}
          <div className="lg:col-span-3">
            {selected ? (
              <div className="bg-white rounded-xl border border-gray-100 p-6 lg:sticky lg:top-20">
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div>
                    <h2 className="font-display font-bold text-[#0E2A47] text-lg">{selected.name} {selected.surname}</h2>
                    <p className="text-xs text-[#8DA5BE] mt-0.5">{formatDate(selected.submittedAt)} · {TYPE_LABEL[selected.type]}</p>
                  </div>
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded border capitalize ${STATUS_COLOR[selected.status]}`}>
                    {selected.status}
                  </span>
                </div>

                {/* Contact info */}
                <div className="grid sm:grid-cols-2 gap-3 mb-5">
                  {[
                    { label: 'Email', value: selected.email, href: `mailto:${selected.email}` },
                    { label: 'Phone', value: selected.phone, href: `tel:${selected.phone}` },
                    { label: 'Company', value: selected.companyName },
                    { label: 'Company Type', value: selected.companyType },
                    { label: 'Department', value: selected.department },
                    { label: 'Location', value: [selected.city, selected.state].filter(Boolean).join(', ') },
                    { label: 'Product', value: selected.product },
                    { label: 'Industry', value: selected.industry },
                  ].filter(f => f.value).map(f => (
                    <div key={f.label} className="bg-[#F7F8FA] rounded-lg px-3 py-2.5">
                      <p className="text-[9px] font-bold text-[#8DA5BE] tracking-widest uppercase mb-0.5">{f.label}</p>
                      {f.href ? (
                        <a href={f.href} className="text-sm text-[#0E2A47] font-medium hover:text-[#F2A71B] transition-colors">{f.value}</a>
                      ) : (
                        <p className="text-sm text-[#0E2A47] font-medium">{f.value}</p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Products list (for enquiry cart) */}
                {selected.products && selected.products.length > 0 && (
                  <div className="mb-4">
                    <p className="text-[10px] font-bold text-[#0E2A47] tracking-widest uppercase mb-2">Products</p>
                    <ul className="space-y-1">
                      {selected.products.map((p, i) => (
                        <li key={i} className="text-sm text-[#5B6B78] flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F2A71B] flex-shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Inquiry text */}
                <div className="mb-5">
                  <p className="text-[10px] font-bold text-[#0E2A47] tracking-widest uppercase mb-2">Inquiry</p>
                  <p className="text-sm text-[#5B6B78] leading-relaxed whitespace-pre-wrap bg-[#F7F8FA] rounded-lg p-3">{selected.inquiry}</p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                  <a
                    href={`mailto:${selected.email}?subject=Re: Your Enquiry - CND Hi-Tech Co.`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#F2A71B] hover:bg-[#D4920F] text-[#0E2A47] font-bold text-xs rounded-lg transition-colors"
                  >
                    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                      <path d="M1.5 2h13A1.5 1.5 0 0 1 16 3.5v9A1.5 1.5 0 0 1 14.5 14h-13A1.5 1.5 0 0 1 0 12.5v-9A1.5 1.5 0 0 1 1.5 2ZM1 3.5v.217l7 4.2 7-4.2V3.5a.5.5 0 0 0-.5-.5h-13a.5.5 0 0 0-.5.5ZM15 5.383l-6.783 4.07a.5.5 0 0 1-.434 0L1 5.383V12.5a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5V5.383Z" />
                    </svg>
                    Reply via Email
                  </a>
                  <a
                    href={`https://wa.me/${selected.phone.replace(/\D/g, '')}?text=Hi ${selected.name}, this is CND Hi-Tech Co. regarding your enquiry.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#25D366] hover:bg-[#1ebe5e] text-white font-bold text-xs rounded-lg transition-colors"
                  >
                    WhatsApp
                  </a>
                  {selected.status !== 'read' && (
                    <button
                      onClick={() => updateStatus(selected.id, 'read')}
                      disabled={updating}
                      className="px-4 py-2 border border-blue-200 text-blue-700 hover:bg-blue-50 font-semibold text-xs rounded-lg transition-colors disabled:opacity-50"
                    >
                      Mark as Read
                    </button>
                  )}
                  {selected.status !== 'replied' && (
                    <button
                      onClick={() => updateStatus(selected.id, 'replied')}
                      disabled={updating}
                      className="px-4 py-2 border border-green-200 text-green-700 hover:bg-green-50 font-semibold text-xs rounded-lg transition-colors disabled:opacity-50"
                    >
                      Mark as Replied
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-100 p-16 text-center text-[#8DA5BE] text-sm">
                Select a submission to view details
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

