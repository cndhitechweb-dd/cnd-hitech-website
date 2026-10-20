import { useState, useMemo } from 'react'
import { usePublicData } from '../data/store'
import type { Page } from '../App'

interface Props {
  onNavigate: (page: Page) => void
  enquiryList: string[]
  onToggleEnquiry: (id: string) => void
  onClearEnquiry: () => void
}

export default function EnquiryCartPage({ onNavigate, enquiryList, onToggleEnquiry, onClearEnquiry }: Props) {
  const publicData = usePublicData()
  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    Object.fromEntries(enquiryList.map(id => [id, 1]))
  )

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

  const handleSubmitWhatsApp = () => {
    const lines = products.map(p => {
      const qty = quantities[p.id] ?? 1
      return `• ${p.name} (${p.catNo}) — Qty: ${qty}`
    }).join('\n')
    const text = `Hi CND Hitech,\n\nI'd like to request a quote for the following products:\n\n${lines}\n\nPlease share pricing and availability. Thank you.`
    window.open(`https://wa.me/919444022338?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
  }

  const handleClearAll = () => {
    onClearEnquiry()
    setQuantities({})
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
                  : `${products.length} product${products.length > 1 ? 's' : ''} selected — review quantities and submit for a quote.`}
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
        {products.length === 0 ? (
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
                            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4.5 h-4.5">
                              <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {product.protectionTypes.map(t => (
                            <span key={t} className="text-[9px] font-medium text-[#5B6B78] bg-[#F7F8FA] border border-gray-200 px-2 py-0.5 rounded">
                              {t}
                            </span>
                          ))}
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
                        <button
                          onClick={() => onNavigate('products')}
                          className="text-[11px] text-[#F2A71B] hover:text-[#D4920F] font-semibold transition-colors"
                        >
                          View Details →
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Summary panel */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 lg:sticky lg:top-24">
                <h2 className="font-display font-bold text-[#0E2A47] text-base mb-5 pb-4 border-b border-gray-100">
                  Enquiry Summary
                </h2>

                <ul className="space-y-3 mb-6">
                  {products.map(p => (
                    <li key={p.id} className="flex items-start justify-between gap-3">
                      <span className="text-[11px] text-[#5B6B78] leading-snug flex-1 line-clamp-2">{p.name}</span>
                      <span className="text-[11px] font-semibold text-[#0E2A47] flex-shrink-0">
                        × {quantities[p.id] ?? 1}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="space-y-3">
                  <button
                    onClick={handleSubmitWhatsApp}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#25D366] hover:bg-[#1ebe5e] text-white font-bold text-sm rounded-lg transition-colors"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Submit via WhatsApp
                  </button>

                  <a
                    href={`mailto:enquiry@cndhitech.com?subject=Product Enquiry&body=${encodeURIComponent(
                      products.map(p => `${p.name} (${p.catNo}) — Qty: ${quantities[p.id] ?? 1}`).join('\n')
                    )}`}
                    className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 text-[#0E2A47] font-semibold text-sm rounded-lg hover:bg-[#F7F8FA] transition-colors"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                    Send via Email
                  </a>

                  <button
                    onClick={() => onNavigate('products')}
                    className="w-full py-2.5 text-[#5B6B78] hover:text-[#0E2A47] text-sm font-medium transition-colors"
                  >
                    ← Continue Shopping
                  </button>
                </div>

                <p className="mt-5 text-[10px] text-[#C8D8E8] leading-relaxed text-center">
                  We respond with full pricing &amp; availability within 24 hours.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
