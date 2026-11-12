import { useState, useMemo } from 'react'
import { usePublicData } from '../data/store'
import type { Page } from '../App'

interface Props {
  onNavigate: (page: Page) => void
  enquiryList: string[]
  onToggleEnquiry: (id: string) => void
  onClearEnquiry: () => void
}

const IC = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#F2A71B] focus:ring-1 focus:ring-[#F2A71B]/30 text-[#0E2A47] placeholder-[#C8D8E8] transition-colors bg-white'

export default function EnquiryCartPage({ onNavigate, enquiryList, onToggleEnquiry, onClearEnquiry }: Props) {
  const publicData = usePublicData()
  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    Object.fromEntries(enquiryList.map(id => [id, 1]))
  )

  // Contact form state
  const [contact, setContact] = useState({ name: '', email: '', phone: '', company: '', message: '' })
  const [contactErrors, setContactErrors] = useState<Partial<typeof contact>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState('')

  const products = useMemo(
    () => publicData.products.filter(p => enquiryList.includes(p.id)),
    [enquiryList, publicData]
  )

  const setQty = (id: string, delta: number) => {
    setQuantities(prev => ({ ...prev, [id]: Math.max(1, (prev[id] ?? 1) + delta) }))
  }

  const handleRemove = (id: string) => {
    onToggleEnquiry(id)
    setQuantities(prev => { const next = { ...prev }; delete next[id]; return next })
  }

  const handleClearAll = () => {
    onClearEnquiry()
    setQuantities({})
  }

  const setC = (k: keyof typeof contact) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContact(prev => ({ ...prev, [k]: e.target.value }))
    if (contactErrors[k]) setContactErrors(prev => ({ ...prev, [k]: undefined }))
  }

  const validateContact = () => {
    const errs: Partial<typeof contact> = {}
    if (!contact.name.trim()) errs.name = 'Required'
    if (!contact.email.trim()) errs.email = 'Required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) errs.email = 'Invalid email'
    if (!contact.phone.trim()) errs.phone = 'Required'
    setContactErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateContact()) return
    setSubmitting(true)
    setServerError('')
    const productList = products.map(p => `${p.name} (${p.catNo}) — Qty: ${quantities[p.id] ?? 1}`).join('\n')
    try {
      const res = await fetch('/api/form-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'enquiry',
          name: contact.name,
          surname: '',
          email: contact.email,
          phone: contact.phone,
          department: '',
          companyName: contact.company,
          companyType: '',
          state: '',
          city: '',
          inquiry: `${contact.message ? contact.message + '\n\n' : ''}Products:\n${productList}`,
          products: products.map(p => `${p.name} (${p.catNo}) × ${quantities[p.id] ?? 1}`),
        }),
      })
      const data = await res.json() as { success?: boolean; error?: string }
      if (!res.ok || !data.success) {
        setServerError(data.error ?? 'Something went wrong. Please try again.')
        return
      }
      setSubmitted(true)
      onClearEnquiry()
    } catch {
      setServerError('Network error. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="pt-16 bg-[#F7F8FA] min-h-screen">
      {/* Page hero */}
      <section className="bg-[#0E2A47] py-12 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(#F2A71B 1px, transparent 1px), linear-gradient(90deg, #F2A71B 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <button
            onClick={() => onNavigate('products')}
            className="inline-flex items-center gap-1.5 text-[#8DA5BE] hover:text-[#F2A71B] text-xs font-medium mb-5 transition-colors"
          >
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
              <path fillRule="evenodd" d="M9.707 4.293a1 1 0 0 1 0 1.414L7.414 8l2.293 2.293a1 1 0 0 1-1.414 1.414l-3-3a1 1 0 0 1 0-1.414l3-3a1 1 0 0 1 1.414 0z" clipRule="evenodd" />
            </svg>
            Back to Products
          </button>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#F2A71B]/30 text-[#F2A71B] text-[11px] font-semibold tracking-widest uppercase mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F2A71B]" />
                Enquiry List
              </div>
              <h1 className="font-display font-extrabold text-white text-3xl md:text-4xl leading-tight">
                Your Enquiry Cart
              </h1>
              <p className="text-[#8DA5BE] text-sm mt-2">
                {products.length === 0
                  ? 'No products added yet.'
                  : `${products.length} product${products.length > 1 ? 's' : ''} selected — fill in your details and submit for a quote.`}
              </p>
            </div>
            {products.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-xs text-[#5B6B78] hover:text-[#F2A71B] transition-colors flex items-center gap-1"
              >
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                  <path fillRule="evenodd" d="M5.5 1.5A.5.5 0 0 1 6 1h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5zM2 3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3.5H2.5A.5.5 0 0 1 2 3zm2 .5v9a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-9H4z" clipRule="evenodd" />
                </svg>
                Clear All
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-10">
        {products.length === 0 && !submitted ? (
          /* Empty state */
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-16 text-center">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#F7F8FA] border border-gray-200 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="#C8D8E8" strokeWidth="1.5" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
            </div>
            <h2 className="font-display font-bold text-[#0E2A47] text-xl mb-2">Your enquiry list is empty</h2>
            <p className="text-[#5B6B78] text-sm mb-8">Browse our product catalog and add items you'd like to get a quote for.</p>
            <button
              onClick={() => onNavigate('products')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#F2A71B] hover:bg-[#D4920F] text-[#0E2A47] font-bold text-sm rounded-lg transition-colors"
            >
              Browse Products
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                <path fillRule="evenodd" d="M8.293 4.293a1 1 0 0 1 1.414 0l3 3a1 1 0 0 1 0 1.414l-3 3a1 1 0 0 1-1.414-1.414L10.086 9H4a1 1 0 0 1 0-2h6.086L8.293 5.707a1 1 0 0 1 0-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ) : submitted ? (
          /* Success state */
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-16 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
              <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="font-display font-bold text-[#0E2A47] text-2xl mb-3">Enquiry Submitted!</h2>
            <p className="text-[#5B6B78] text-sm leading-relaxed mb-8">
              Thank you, <strong>{contact.name}</strong>. Your product enquiry has been received.
              Our team will respond within 24 hours with pricing and availability.
            </p>
            <button
              onClick={() => onNavigate('products')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#F2A71B] hover:bg-[#D4920F] text-[#0E2A47] font-bold text-sm rounded-lg transition-colors"
            >
              Browse More Products
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Product list */}
            <div className="lg:col-span-2 space-y-4">
              {products.map(product => {
                const qty = quantities[product.id] ?? 1
                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col sm:flex-row"
                  >
                    {/* Image */}
                    <div
                      className="sm:w-36 flex-shrink-0 flex items-center justify-center p-4"
                      style={{ background: product.imgBg ?? '#F7F8FA' }}
                    >
                      <img
                        src={product.img}
                        alt={product.name}
                        className={`h-24 w-full ${product.productShot ? 'object-contain' : 'object-cover'}`}
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 p-5 flex flex-col justify-between gap-4">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="inline-block px-2 py-0.5 text-[9px] font-bold text-[#F2A71B] bg-[#F2A71B]/10 border border-[#F2A71B]/20 rounded tracking-widest uppercase mb-1.5">
                              {product.protectionTypes[0]}
                            </span>
                            <h3 className="font-display font-bold text-[#0E2A47] text-[15px] leading-snug">{product.name}</h3>
                            <p className="text-[#8DA5BE] text-xs mt-0.5">Cat No: {product.catNo}</p>
                          </div>
                          <button
                            onClick={() => handleRemove(product.id)}
                            className="text-[#C8D8E8] hover:text-red-400 transition-colors flex-shrink-0 mt-0.5"
                            aria-label="Remove"
                          >
                            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                              <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Quantity */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] font-semibold text-[#0E2A47] tracking-wide uppercase">Qty</span>
                          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                            <button
                              onClick={() => setQty(product.id, -1)}
                              className="w-8 h-8 flex items-center justify-center text-[#0E2A47] hover:bg-[#F7F8FA] transition-colors text-lg font-medium"
                            >
                              −
                            </button>
                            <span className="w-10 text-center text-sm font-bold text-[#0E2A47] border-x border-gray-200">
                              {qty}
                            </span>
                            <button
                              onClick={() => setQty(product.id, +1)}
                              className="w-8 h-8 flex items-center justify-center text-[#0E2A47] hover:bg-[#F7F8FA] transition-colors text-lg font-medium"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Summary + Contact form panel */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 lg:sticky lg:top-24">
                <h2 className="font-display font-bold text-[#0E2A47] text-base mb-4 pb-3 border-b border-gray-100">
                  Submit Enquiry
                </h2>

                {/* Product summary */}
                <ul className="space-y-2 mb-5">
                  {products.map(p => (
                    <li key={p.id} className="flex items-start justify-between gap-3">
                      <span className="text-[11px] text-[#5B6B78] leading-snug flex-1 line-clamp-2">{p.name}</span>
                      <span className="text-[11px] font-semibold text-[#0E2A47] flex-shrink-0">
                        × {quantities[p.id] ?? 1}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Contact form */}
                <form onSubmit={handleSubmit} noValidate className="space-y-3 border-t border-gray-100 pt-4">
                  <p className="text-[10px] font-bold text-[#0E2A47] tracking-widest uppercase mb-1">Your Details</p>

                  <div>
                    <input
                      type="text"
                      placeholder="Your name *"
                      value={contact.name}
                      onChange={setC('name')}
                      className={IC}
                    />
                    {contactErrors.name && <p className="mt-1 text-[11px] text-[#E53935]">{contactErrors.name}</p>}
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email address *"
                      value={contact.email}
                      onChange={setC('email')}
                      className={IC}
                    />
                    {contactErrors.email && <p className="mt-1 text-[11px] text-[#E53935]">{contactErrors.email}</p>}
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Phone number *"
                      value={contact.phone}
                      onChange={setC('phone')}
                      className={IC}
                    />
                    {contactErrors.phone && <p className="mt-1 text-[11px] text-[#E53935]">{contactErrors.phone}</p>}
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Company name"
                      value={contact.company}
                      onChange={setC('company')}
                      className={IC}
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Additional notes (optional)"
                      value={contact.message}
                      onChange={setC('message')}
                      rows={3}
                      className={IC + ' resize-none'}
                    />
                  </div>

                  {serverError && (
                    <p className="text-xs text-[#E53935] bg-red-50 border border-red-100 rounded-lg px-3 py-2">{serverError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-[#F2A71B] hover:bg-[#D4920F] disabled:opacity-60 disabled:cursor-not-allowed text-[#0E2A47] font-bold text-sm rounded-lg transition-colors"
                  >
                    {submitting ? 'Submitting…' : 'Submit Enquiry →'}
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('products')}
                    className="w-full py-2 text-[#5B6B78] hover:text-[#0E2A47] text-sm font-medium transition-colors"
                  >
                    ← Continue Shopping
                  </button>
                </form>

                <p className="mt-4 text-[10px] text-[#C8D8E8] leading-relaxed text-center">
                  We respond with pricing &amp; availability within 24 hours.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
