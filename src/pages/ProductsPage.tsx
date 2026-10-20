import { useState, useMemo, useEffect } from 'react'
import type { Product } from '../data/products'
import { getPublicData, usePublicData, setQuoteContext, type PublicProduct } from '../data/store'

import type { Page } from '../App'
interface Props {
  onNavigate: (page: Page) => void
  enquiryList: string[]
  onToggleEnquiry: (id: string) => void
  onClearEnquiry: () => void
  onViewEnquiry: () => void
}

type ProductViewLevel =
  | { level: 'categories' }
  | { level: 'subcategories'; categoryLabel: string }
  | { level: 'products'; categoryLabel: string; subcategory: string }
  | { level: 'product-detail'; categoryLabel: string; subcategory: string; productId: string }

// ─── Data Helpers ──────────────────────────────────────────────────────────────

function subcatsForGroup(groupLabel: string): string[] {
  const group = getPublicData().groups.find(g => g.label === groupLabel)
  if (!group) return []
  return group.subcategories.length > 0 ? group.subcategories : [groupLabel]
}

function firstProductForGroup(groupLabel: string): Product | undefined {
  for (const sub of subcatsForGroup(groupLabel)) {
    const p = getPublicData().products.find(p => p.category === sub)
    if (p) return p
  }
  return undefined
}

function firstProductForSubcategory(sub: string): Product | undefined {
  return getPublicData().products.find(p => p.category === sub)
}

function productCountForGroup(groupLabel: string): number {
  return getPublicData().products.filter(p => subcatsForGroup(groupLabel).includes(p.category)).length
}

function productCountForSubcategory(sub: string): number {
  return getPublicData().products.filter(p => p.category === sub).length
}

// ─── Category Metadata ────────────────────────────────────────────────────────

function catDesc(label: string): string {
  return getPublicData().groups.find(g => g.label === label)?.description || CATEGORY_DESCRIPTIONS[label] || ''
}

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'LIGHT FITTINGS': 'Ex d certified LED luminaires, high-bay fittings, floodlights, bulkheads & handlamps for Zone 1 & 2 hazardous areas.',
  'JUNCTION BOXES': 'Flameproof aluminium junction boxes for lighting, multi-way cable distribution and industrial panel applications.',
  'CONTROL STATIONS': 'Push-button, emergency stop & selector switch stations in flameproof Ex d and increased safety Ex e enclosures.',
  'PLUG & SOCKETS': 'Industrial explosion-proof plugs & socket connectors 16A–63A, rated IP66/67 for portable equipment power.',
  'SWITCHES': 'Flameproof isolating switches, rotary switches and weatherproof distribution boards for safe power control.',
  'COMMUNICATION': 'Explosion-proof loudspeakers, intercoms, telephone systems, hooters and acoustic booths for PA & alarm systems.',
  'FIRE ALARM': 'Manual call points and break-glass fire alarm stations certified Ex d for Zone 1 & 2 hazardous environments.',
  'CABLE GLANDS': 'Ex d & Ex e stainless steel cable glands in metric and NPT thread sizes for armoured and unarmoured cables.',
  'BLANKING PLUGS': 'Stainless steel blanking plugs IP66 rated for sealing unused cable entries in explosion-proof enclosures.',
  'WIRING ACCESSORIES': 'Industrial conduit fittings, flexible conduit and wiring accessories for hazardous area installations.',
}

const CATEGORY_TAGLINES: Record<string, string> = {
  'LIGHT FITTINGS': 'Flameproof Explosion Proof Luminaires Manufacturers & Exporters in India',
  'JUNCTION BOXES': 'Flameproof Explosion Proof Junction Box Manufacturers & Exporters in India',
  'CONTROL STATIONS': 'Flameproof Explosion Proof Control Stations Manufacturers & Exporters in India',
  'PLUG & SOCKETS': 'Flameproof Explosion Proof Plugs & Sockets Manufacturers & Exporters in India',
  'SWITCHES': 'Flameproof Explosion Proof Rotary Switches Manufacturers & Exporters in India',
  'COMMUNICATION': 'Explosion Proof Communication Equipment Manufacturers & Exporters in India',
  'FIRE ALARM': 'Explosion Proof Fire Alarm Equipment Manufacturers & Exporters in India',
  'CABLE GLANDS': 'Explosion Proof Cable Glands Manufacturers & Exporters in India',
  'BLANKING PLUGS': 'Explosion Proof Blanking Plugs Manufacturers & Exporters in India',
  'WIRING ACCESSORIES': 'Explosion Proof Wiring Accessories Manufacturers & Exporters in India',
}

// ─── Shared UI ────────────────────────────────────────────────────────────────

function ChevronRight({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={`w-3.5 h-3.5 ${className}`}>
      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
  )
}

function ArrowRight({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 ${className}`}>
      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  )
}

// ─── Category Icons ───────────────────────────────────────────────────────────

const CATEGORY_ICON: Record<string, React.ReactNode> = {
  'LIGHT FITTINGS': (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M10 2v1M10 17v1M3.22 4.22l.7.7M15.36 15.36l.7.7M2 11h1M17 11h1M4.92 15.36l-.7.7M14.36 4.92l.7-.7" />
      <path d="M7.5 14h5M8 16h4" />
      <circle cx="10" cy="9" r="3.5" />
    </svg>
  ),
  'JUNCTION BOXES': (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="3" y="4" width="14" height="12" rx="1.5" />
      <line x1="7" y1="4" x2="7" y2="2" />
      <line x1="10" y1="4" x2="10" y2="2" />
      <line x1="13" y1="4" x2="13" y2="2" />
      <line x1="7" y1="16" x2="7" y2="18" />
      <line x1="10" y1="16" x2="10" y2="18" />
      <line x1="13" y1="16" x2="13" y2="18" />
      <circle cx="10" cy="10" r="1.5" />
    </svg>
  ),
  'CONTROL STATIONS': (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="2" y="3" width="16" height="14" rx="1.5" />
      <line x1="2" y1="7.5" x2="18" y2="7.5" />
      <circle cx="5.5" cy="5.5" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="8.5" cy="5.5" r="0.9" fill="currentColor" stroke="none" />
      <rect x="5" y="10" width="4" height="4.5" rx="0.5" />
      <line x1="12" y1="10.5" x2="15.5" y2="10.5" />
      <line x1="12" y1="12.5" x2="15.5" y2="12.5" />
      <line x1="12" y1="14.5" x2="14" y2="14.5" />
    </svg>
  ),
  'PLUG & SOCKETS': (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="10" cy="10" r="7" />
      <line x1="8" y1="7" x2="8" y2="9.5" />
      <line x1="12" y1="7" x2="12" y2="9.5" />
      <path d="M7.5 9.5h5a2.5 2.5 0 01-5 0z" />
      <line x1="10" y1="12" x2="10" y2="14" />
    </svg>
  ),
  'SWITCHES': (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="2" y="5" width="16" height="10" rx="5" />
      <circle cx="7" cy="10" r="3" fill="currentColor" fillOpacity="0.12" stroke="currentColor" />
    </svg>
  ),
  'COMMUNICATION': (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M3.5 5.5C5.5 3.5 8 2.5 10 2.5s4.5 1 6.5 3" />
      <path d="M6 8c1.1-1.1 2.5-1.7 4-1.7s2.9.6 4 1.7" />
      <path d="M8.5 10.5c.8-.8 1.5-1 1.5-1s.7.2 1.5 1" />
      <circle cx="10" cy="13" r="1.2" fill="currentColor" stroke="none" />
      <line x1="10" y1="14.2" x2="10" y2="17" />
    </svg>
  ),
  'FIRE ALARM': (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M10 2c0 2-2 3-2 5a4 4 0 008 0c0-2-2-3-2-5" />
      <path d="M10 7c0 1-1 1.5-1 2.5a2.5 2.5 0 005 0C14 8.5 13 8 13 7" />
      <line x1="10" y1="14" x2="10" y2="16" />
      <line x1="7" y1="17" x2="13" y2="17" />
    </svg>
  ),
  'CABLE GLANDS': (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <line x1="2" y1="10" x2="6" y2="10" />
      <rect x="6" y="7.5" width="3" height="5" rx="0.5" />
      <rect x="9" y="8.5" width="2" height="3" rx="0.5" />
      <rect x="11" y="7" width="3" height="6" rx="0.5" />
      <line x1="14" y1="10" x2="18" y2="10" />
      <line x1="4" y1="8" x2="4" y2="12" />
      <line x1="16" y1="8" x2="16" y2="12" />
    </svg>
  ),
  'BLANKING PLUGS': (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="10" cy="10" r="7" />
      <circle cx="10" cy="10" r="3.5" />
      <line x1="7.5" y1="7.5" x2="5" y2="5" />
      <line x1="12.5" y1="7.5" x2="15" y2="5" />
      <line x1="12.5" y1="12.5" x2="15" y2="15" />
      <line x1="7.5" y1="12.5" x2="5" y2="15" />
    </svg>
  ),
  'WIRING ACCESSORIES': (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M3 6h3l1.5 2.5L9 4l2 8 2-6 1.5 4H17" />
      <line x1="3" y1="14" x2="17" y2="14" />
    </svg>
  ),
}

// ─── Category-Scoped Sidebar (used in ProductListing Level 3) ────────────────

function CategoryScopedSidebar({
  categoryLabel,
  subcats,
  activeSubcat,
  onSelectSubcategory,
}: {
  categoryLabel: string
  subcats: string[]
  activeSubcat: string
  onSelectSubcategory: (categoryLabel: string, sub: string) => void
}) {
  return (
    <aside className="w-56 flex-shrink-0">
      <div className="lg:sticky lg:top-24 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3.5 bg-[#F7F8FA] border-b border-gray-100">
          <span className="text-[10px] font-bold text-[#0E2A47] tracking-widest uppercase">Series</span>
          <p className="text-[11px] font-semibold text-[#5B6B78] truncate mt-0.5">{categoryLabel}</p>
        </div>
        <nav className="py-1.5">
          {subcats.map(sub => {
            const count = productCountForSubcategory(sub)
            const isActive = sub === activeSubcat
            return (
              <button
                key={sub}
                onClick={() => onSelectSubcategory(categoryLabel, sub)}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-colors duration-100 border-l-2 ${isActive ? 'border-[#F2A71B] bg-[#FFF8EC]' : 'border-transparent hover:bg-[#F7F8FA]'}`}
              >
                <span className={`flex-1 text-xs leading-snug ${isActive ? 'text-[#0E2A47] font-semibold' : 'text-[#5B6B78] font-medium'}`}>
                  {sub}
                </span>
                <span className={`text-[9px] flex-shrink-0 ${isActive ? 'text-[#F2A71B] font-semibold' : 'text-[#C8D8E8]'}`}>{count}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}

// ─── Product Card ─────────────────────────────────────────────────────────────

interface CardProps {
  product: Product
  inEnquiry: boolean
  onViewDetails: () => void
  onToggleEnquiry: () => void
}

function ProductCard({ product, inEnquiry, onViewDetails, onToggleEnquiry }: CardProps) {
  const [imgLoaded, setImgLoaded] = useState(false)

  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-[0_4px_24px_rgba(14,42,71,0.1)] hover:border-[#F2A71B]/40 transition-all duration-200 group overflow-hidden flex flex-col">
      <div className="relative aspect-square overflow-hidden cursor-pointer" style={{ background: product.imgBg }} onClick={onViewDetails}>
        {!imgLoaded && <div className="absolute inset-0 animate-pulse" style={{ background: product.imgBg }} />}
        <img
          src={product.img}
          alt={product.name}
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full transition-all duration-500 group-hover:scale-[1.04] ${imgLoaded ? 'opacity-100' : 'opacity-0'} ${product.productShot ? 'object-contain p-5' : 'object-cover'}`}
        />
        <div className={`absolute inset-0 transition-all duration-300 ${product.productShot ? 'bg-[#0E2A47]/0 group-hover:bg-[#0E2A47]/10' : 'bg-[#0E2A47]/0 group-hover:bg-[#0E2A47]/18'}`} />
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#0E2A47] text-[#F2A71B] text-[9.5px] font-bold tracking-wide rounded shadow-sm">
            {product.protectionTypes[0]}
          </span>
        </div>
        <button
          onClick={e => { e.stopPropagation(); onToggleEnquiry() }}
          className={`absolute top-3 right-3 w-8 h-8 rounded flex items-center justify-center transition-all duration-150 shadow-sm ${inEnquiry ? 'bg-[#F2A71B] text-[#0E2A47]' : 'bg-white/90 text-[#5B6B78] hover:bg-[#F2A71B] hover:text-[#0E2A47] opacity-0 group-hover:opacity-100'}`}
          title={inEnquiry ? 'Remove from enquiry' : 'Add to enquiry'}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            {inEnquiry
              ? <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              : <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />}
          </svg>
        </button>
        {!product.productShot && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#071829]/70 to-transparent px-4 py-3">
            <div className="text-[#F2A71B] text-[10px] font-bold tracking-widest uppercase">{product.catNo}</div>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        {product.productShot && (
          <div className="text-[#F2A71B] text-[10px] font-bold tracking-widest uppercase mb-1">{product.catNo}</div>
        )}
        <h3 className="font-display font-bold text-[#0E2A47] text-sm leading-snug mb-1.5 line-clamp-2">{product.name}</h3>
        <p className="text-[#5B6B78] text-[11px] leading-relaxed mb-4 flex-1">{product.specSummary}</p>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <button onClick={onViewDetails} className="text-[#F2A71B] text-xs font-semibold hover:text-[#D4920F] transition-colors flex items-center gap-1">
            View Details <ArrowRight />
          </button>
          <span className="text-[10px] text-[#5B6B78] bg-[#EEF2F6] px-2 py-0.5 rounded font-medium">{product.category}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Product Detail Page (Level 4) ───────────────────────────────────────────

export function ProductDetailPage({
  product,
  categoryLabel,
  subcategory,
  inEnquiry,
  onToggleEnquiry,
  onNavigateHome,
  onNavigateCategories,
  onNavigateSubcategories,
  onNavigateProducts,
  onQuote,
  preview,
}: {
  product: PublicProduct
  categoryLabel: string
  subcategory: string
  inEnquiry: boolean
  onToggleEnquiry: () => void
  onNavigateHome: () => void
  onNavigateCategories: () => void
  onNavigateSubcategories: (label: string) => void
  onNavigateProducts: (categoryLabel: string, subcategory: string) => void
  onQuote: () => void
  preview?: boolean
}) {
  const [activeImg, setActiveImg] = useState(product.img)
  const [quantity, setQuantity] = useState(1)
  const allImages = [product.img, ...(product.extraImages ?? [])]

  useEffect(() => { setActiveImg(product.img); setQuantity(1) }, [product])

  const openPdf = () => product.pdfUrl && window.open(product.pdfUrl, '_blank', 'noopener,noreferrer')
  const specEntries = Object.entries(product.specs)

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* Breadcrumb strip */}
      <div className={preview ? '' : 'pt-16'}>
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 h-10 flex items-center">
            <nav className="flex items-center gap-1.5 text-xs flex-wrap">
              <button onClick={onNavigateHome} className="text-[#5B6B78] hover:text-[#F2A71B] transition-colors font-medium">Home</button>
              <ChevronRight className="text-gray-300" />
              <button onClick={onNavigateCategories} className="text-[#5B6B78] hover:text-[#F2A71B] transition-colors font-medium">Products</button>
              <ChevronRight className="text-gray-300" />
              <button onClick={() => onNavigateSubcategories(categoryLabel)} className="text-[#5B6B78] hover:text-[#F2A71B] transition-colors font-medium">{categoryLabel}</button>
              <ChevronRight className="text-gray-300" />
              <button onClick={() => onNavigateProducts(categoryLabel, subcategory)} className="text-[#5B6B78] hover:text-[#F2A71B] transition-colors font-medium">{subcategory}</button>
              <ChevronRight className="text-gray-300" />
              <span className="text-[#0E2A47] font-semibold truncate max-w-[180px]">{product.catNo}</span>
            </nav>
          </div>
        </div>
      </div>

      {/* Dark hero header */}
      <div className="bg-[#0E2A47]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-8 pb-10">
          <div className="text-[#5B6B78] text-[10px] font-bold tracking-[0.2em] uppercase mb-2">{categoryLabel} — {subcategory}</div>
          <h1 className="font-display font-bold text-white text-2xl md:text-3xl mb-3 leading-snug">{product.name}</h1>
          <div className="flex flex-wrap gap-2">
            {product.protectionTypes.map(t => (
              <span key={t} className="px-2.5 py-1 border border-[#F2A71B]/30 text-[#F2A71B] text-[10px] font-bold rounded tracking-widest">{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-8">

          {/* Left column: images */}
          <div>
            <div
              className={`relative rounded-xl overflow-hidden mb-3 ${product.pdfUrl ? 'cursor-pointer group/img' : ''}`}
              style={{ background: product.imgBg, aspectRatio: '4/3' }}
              onClick={product.pdfUrl ? openPdf : undefined}
            >
              <img
                src={activeImg}
                alt={product.name}
                className={`absolute inset-0 w-full h-full ${product.productShot ? 'object-contain p-10' : 'object-cover'}`}
              />
              {product.pdfUrl && (
                <div className="absolute inset-0 bg-[#0E2A47]/0 group-hover/img:bg-[#0E2A47]/65 transition-all duration-200 flex flex-col items-center justify-center gap-3">
                  <div className="opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 flex flex-col items-center gap-2">
                    <div className="w-14 h-14 rounded-full border-2 border-[#F2A71B] flex items-center justify-center bg-[#0E2A47]/40">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#F2A71B" strokeWidth="1.5" className="w-7 h-7">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>
                    <p className="text-white text-sm font-bold tracking-wide">Open Datasheet PDF</p>
                    <p className="text-[#AABDD0] text-[11px]">Opens in a new tab</p>
                  </div>
                </div>
              )}
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {allImages.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(src)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-150 flex-shrink-0 ${activeImg === src ? 'border-[#F2A71B]' : 'border-gray-200 hover:border-[#F2A71B]/50'}`}
                    style={{ background: product.imgBg }}
                  >
                    <img src={src} alt={`View ${i + 1}`} className={`w-full h-full ${product.productShot ? 'object-contain p-1' : 'object-cover'}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right column: info, quantity, actions */}
          <div>
            <div className="text-[#F2A71B] text-[10px] font-bold tracking-[0.2em] uppercase mb-2">{product.catNo}</div>
            <p className="text-[#5B6B78] text-sm leading-relaxed mb-6">{product.description}</p>

            {/* Quantity selector */}
            <div className="flex items-center gap-4 mb-5 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
              <span className="text-[#0E2A47] text-sm font-semibold">Quantity</span>
              <div className="flex items-center gap-0 rounded-lg border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center text-[#0E2A47] hover:bg-[#FFF8EC] hover:text-[#F2A71B] transition-colors font-bold text-lg border-r border-gray-200"
                >
                  −
                </button>
                <span className="w-12 text-center font-display font-bold text-[#0E2A47] text-base tabular-nums">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-9 h-9 flex items-center justify-center text-[#0E2A47] hover:bg-[#FFF8EC] hover:text-[#F2A71B] transition-colors font-bold text-lg border-l border-gray-200"
                >
                  +
                </button>
              </div>
              <span className="text-[#8DA5BE] text-[10px] ml-auto">Min. 1 unit</span>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-7">
              <button
                onClick={onQuote}
                className="flex-1 px-5 py-3 bg-[#F2A71B] hover:bg-[#D4920F] text-[#0E2A47] font-bold text-sm rounded transition-colors duration-150"
              >
                Request Quote
              </button>
              <button
                onClick={onToggleEnquiry}
                className={`flex-1 px-5 py-3 border-2 font-bold text-sm rounded transition-all duration-150 flex items-center justify-center gap-2 ${inEnquiry ? 'border-[#0E2A47] bg-[#0E2A47] text-white' : 'border-[#0E2A47] text-[#0E2A47] hover:bg-[#0E2A47] hover:text-white'}`}
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  {inEnquiry
                    ? <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    : <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />}
                </svg>
                {inEnquiry ? 'In Enquiry List' : 'Add to Enquiry'}
              </button>
            </div>

            {product.features.filter(Boolean).length > 0 && (
              <div className="mb-7">
                <h3 className="text-[10px] font-bold tracking-[0.2em] text-[#5B6B78] uppercase mb-3">Key Features</h3>
                <ul className="space-y-1.5">
                  {product.features.filter(Boolean).map((f, i) => (
                    <li key={i} className="flex gap-2 text-sm text-[#44566A]"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#F2A71B] shrink-0" />{f}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specs table */}
            {specEntries.length > 0 && <h3 className="text-[10px] font-bold tracking-[0.2em] text-[#5B6B78] uppercase mb-3">Technical Specifications</h3>}
            <div className="border border-gray-100 rounded-lg overflow-hidden">
              {specEntries.map(([key, val], i) => (
                <div key={key} className={`grid grid-cols-[42%_58%] text-xs ${i % 2 === 0 ? 'bg-[#F7F8FA]' : 'bg-white'}`}>
                  <div className="px-4 py-2.5 text-[#5B6B78] font-medium border-r border-gray-100">{key}</div>
                  <div className="px-4 py-2.5 text-[#0E2A47] font-semibold font-mono text-[10.5px] leading-snug">{val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {product.applications.filter(Boolean).length > 0 && (
          <div className="grid grid-cols-1 gap-8 mb-8 bg-white border border-gray-100 rounded-xl p-6">
            {product.applications.filter(Boolean).length > 0 && (
              <div>
                <h3 className="text-[10px] font-bold tracking-[0.2em] text-[#5B6B78] uppercase mb-3">Applications</h3>
                <ul className="space-y-1.5">
                  {product.applications.filter(Boolean).map((a, i) => (
                    <li key={i} className="flex gap-2 text-sm text-[#44566A]"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#F2A71B] shrink-0" />{a}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* PDF downloads (only when a PDF is attached) */}
        {product.pdfs.length > 0 && (
          <div className="flex flex-col gap-3">
            {product.pdfs.map(pdf => (
              <a
                key={pdf.id}
                href={pdf.url}
                target="_blank"
                rel="noopener noreferrer"
                download={`${pdf.name.replace(/\.pdf$/i, '')}.pdf`}
                className="w-full flex items-center gap-4 p-4 bg-[#0E2A47] hover:bg-[#163A5F] rounded-xl transition-colors duration-150 group/pdf"
              >
                <div className="w-10 h-10 rounded bg-[#F2A71B] flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#0E2A47]">
                    <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625z" />
                    <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-white text-sm font-bold">{pdf.type === 'Product Catalogue' ? 'Download Catalogue' : 'Download Product PDF'} — {pdf.name}</div>
                  <div className="text-[#AABDD0] text-xs">Opens the PDF in a new tab →</div>
                </div>
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-[#F2A71B] ml-auto flex-shrink-0 group-hover/pdf:translate-x-0.5 transition-transform">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Enquiry Bar ──────────────────────────────────────────────────────────────

function EnquiryBar({ count, products, onClear, onViewCart }: { count: number; products: Product[]; onClear: () => void; onViewCart: () => void }) {
  if (count === 0) return null
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-5 py-3 bg-[#0E2A47] text-white rounded-full shadow-[0_8px_32px_rgba(14,42,71,0.4)] border border-[#1C4570]">
      <div className="flex items-center gap-2">
        <span className="w-5 h-5 rounded-full bg-[#F2A71B] text-[#0E2A47] text-[10px] font-bold flex items-center justify-center">{count}</span>
        <span className="text-sm font-medium">{count === 1 ? '1 product' : `${count} products`} in Enquiry List</span>
      </div>
      <button onClick={onViewCart} className="px-4 py-1.5 bg-[#F2A71B] text-[#0E2A47] text-xs font-bold rounded-full hover:bg-[#D4920F] transition-colors flex items-center gap-1.5">
        <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
          <path d="M1.5 1.5A.5.5 0 0 1 2 1h1a.5.5 0 0 1 .485.379L3.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.512 2H1a.5.5 0 0 1-.5-.5v-1z"/>
          <path d="M6 14a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm7 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
        </svg>
        View Enquiry Cart
      </button>
      <button onClick={onClear} className="text-[#5B6B78] hover:text-white transition-colors text-xs">Clear</button>
    </div>
  )
}

// ─── Level 1: Categories Grid ─────────────────────────────────────────────────

interface CategoriesGridProps {
  onNavigateHome: () => void
  onSelectCategory: (label: string) => void
}

function CategoriesGrid({ onNavigateHome, onSelectCategory }: CategoriesGridProps) {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* Fixed nav clearance + breadcrumb strip */}
      <div className="pt-16">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 h-10 flex items-center">
            <nav className="flex items-center gap-1.5 text-xs flex-wrap">
              <button onClick={onNavigateHome} className="text-[#5B6B78] hover:text-[#F2A71B] transition-colors font-medium">Home</button>
              <ChevronRight className="text-gray-300" />
              <span className="text-[#0E2A47] font-semibold">Products</span>
            </nav>
          </div>
        </div>
      </div>

      {/* Page header */}
      <div className="bg-[#0E2A47]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-8 pb-10">
          <h1 className="font-display font-bold text-white text-3xl md:text-4xl mb-2">Our Product Catalogue</h1>
          <p className="text-[#8DA5BE] text-sm max-w-2xl leading-relaxed">
            Complete range of IECEx, ATEX, PESO & BIS certified explosion-proof equipment for hazardous area classifications. Select a category to explore the full product range.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-6">
            {['IECEx', 'ATEX', 'PESO', 'BIS', 'CMRI'].map(cert => (
              <span key={cert} className="px-2.5 py-1 border border-[#F2A71B]/30 text-[#F2A71B] text-[10px] font-bold rounded tracking-widest">{cert}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-10">
        <p className="text-[#5B6B78] text-xs font-semibold tracking-widest uppercase mb-6">
          {getPublicData().groups.length} Product Categories
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {getPublicData().groups.map(group => {
            const rep = firstProductForGroup(group.label)
            const count = productCountForGroup(group.label)
            const subcatCount = group.subcategories.length
            const icon = CATEGORY_ICON[group.label]
            const isHovered = hovered === group.label

            return (
              <div
                key={group.label}
                onMouseEnter={() => setHovered(group.label)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onSelectCategory(group.label)}
                className={`bg-white rounded-xl border overflow-hidden cursor-pointer transition-all duration-200 flex flex-col shadow-sm ${isHovered ? 'border-[#F2A71B]/50 shadow-[0_8px_32px_rgba(14,42,71,0.12)] -translate-y-0.5' : 'border-gray-100 hover:border-[#F2A71B]/30'}`}
              >
                {/* Image area */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[#F7F8FA] flex items-center justify-center">
                  {rep ? (
                    <img
                      src={rep.img}
                      alt={group.label}
                      className={`w-full h-full transition-transform duration-500 ${isHovered ? 'scale-[1.04]' : 'scale-100'} ${rep.productShot ? 'object-contain p-6' : 'object-cover'}`}
                    />
                  ) : (
                    <div className="text-[#C8D8E8] w-14 h-14">{icon}</div>
                  )}
                  {/* Top amber accent bar */}
                  <div className={`absolute top-0 left-0 right-0 h-0.5 bg-[#F2A71B] transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
                  {/* Category badge */}
                  <div className="absolute top-3 left-3">
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-[#0E2A47]/85 backdrop-blur-sm rounded">
                      <span className="text-[#F2A71B] w-3.5 h-3.5 flex-shrink-0">{icon}</span>
                    </div>
                  </div>
                  {count > 0 && (
                    <div className="absolute bottom-3 right-3">
                      <span className="px-2 py-0.5 bg-[#0E2A47]/85 backdrop-blur-sm text-[#F2A71B] text-[9.5px] font-bold rounded tracking-wide">
                        {count} {count === 1 ? 'product' : 'products'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-display font-bold text-[#0E2A47] text-sm leading-snug mb-1">
                    {group.label}
                  </h3>
                  <p className="text-[#5B6B78] text-[11px] leading-relaxed mb-1 flex-1 line-clamp-2">
                    {catDesc(group.label)}
                  </p>
                  {subcatCount > 0 && (
                    <p className="text-[#8DA5BE] text-[10px] mb-3">{subcatCount} {subcatCount === 1 ? 'model series' : 'model series'}</p>
                  )}
                  <div className={`mt-auto pt-3 border-t border-gray-100 flex items-center justify-between`}>
                    <span className={`text-xs font-bold transition-colors duration-150 flex items-center gap-1 ${isHovered ? 'text-[#F2A71B]' : 'text-[#5B6B78]'}`}>
                      View Details <ArrowRight className={`transition-transform duration-150 ${isHovered ? 'translate-x-0.5' : ''}`} />
                    </span>
                    <span className="text-[9.5px] text-[#8DA5BE]">Ex d / Ex e</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Level 2: Subcategories Page ──────────────────────────────────────────────

interface SubcategoriesPageProps {
  categoryLabel: string
  onNavigateHome: () => void
  onNavigateCategories: () => void
  onSelectCategory: (label: string) => void
  onSelectSubcategory: (categoryLabel: string, sub: string) => void
}

function SubcategoriesPage({ categoryLabel, onNavigateHome, onNavigateCategories, onSelectCategory, onSelectSubcategory }: SubcategoriesPageProps) {
  const [hovered, setHovered] = useState<string | null>(null)
  const group = getPublicData().groups.find(g => g.label === categoryLabel)
  const subcats = group?.subcategories ?? []
  const tagline = CATEGORY_TAGLINES[categoryLabel] ?? categoryLabel
  const icon = CATEGORY_ICON[categoryLabel]

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* Fixed nav clearance + breadcrumb strip */}
      <div className="pt-16">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 h-10 flex items-center">
            <nav className="flex items-center gap-1.5 text-xs flex-wrap">
              <button onClick={onNavigateHome} className="text-[#5B6B78] hover:text-[#F2A71B] transition-colors font-medium">Home</button>
              <ChevronRight className="text-gray-300" />
              <button onClick={onNavigateCategories} className="text-[#5B6B78] hover:text-[#F2A71B] transition-colors font-medium">Products</button>
              <ChevronRight className="text-gray-300" />
              <span className="text-[#0E2A47] font-semibold">{categoryLabel}</span>
            </nav>
          </div>
        </div>
      </div>

      {/* Hero banner */}
      <div className="bg-[#0E2A47] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'linear-gradient(#F2A71B 1px, transparent 1px), linear-gradient(90deg, #F2A71B 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-[0.06]" style={{ background: 'linear-gradient(135deg, transparent 30%, #F2A71B 100%)' }} />
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-8 pb-12">
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-xl bg-[#F2A71B]/10 border border-[#F2A71B]/25 flex items-center justify-center text-[#F2A71B] flex-shrink-0">
              {icon}
            </div>
            <div>
              <h1 className="font-display font-bold text-white text-3xl md:text-4xl mb-2 leading-tight">{categoryLabel}</h1>
              <p className="text-[#8DA5BE] text-sm max-w-2xl leading-relaxed">{tagline}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Left sidebar — category navigation */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="lg:sticky lg:top-24 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 bg-[#F7F8FA]">
                <span className="text-[10px] font-bold text-[#0E2A47] tracking-widest uppercase">All Categories</span>
              </div>
              <nav className="py-2">
                {getPublicData().groups.map(g => {
                  const isActive = g.label === categoryLabel
                  const gIcon = CATEGORY_ICON[g.label]
                  return (
                    <button
                      key={g.label}
                      onClick={() => onSelectCategory(g.label)}
                      className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-colors duration-150 group/nav ${isActive ? 'bg-[#FFF8EC] border-r-2 border-[#F2A71B]' : 'hover:bg-[#F7F8FA]'}`}
                    >
                      <span className={`flex-shrink-0 ${isActive ? 'text-[#F2A71B]' : 'text-[#8DA5BE] group-hover/nav:text-[#F2A71B]'} transition-colors`}>
                        {gIcon}
                      </span>
                      <span className={`text-xs leading-tight ${isActive ? 'text-[#0E2A47] font-bold' : 'text-[#5B6B78] font-medium group-hover/nav:text-[#0E2A47]'} transition-colors`}>
                        {g.label}
                      </span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="mb-6 pb-4 border-b border-gray-200">
              <h2 className="font-display font-bold text-[#0E2A47] text-lg md:text-xl mb-1">{tagline}</h2>
              <p className="text-[#5B6B78] text-sm">{catDesc(categoryLabel)}</p>
            </div>

            {subcats.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center max-w-md mx-auto">
                <div className="w-20 h-20 rounded-full bg-[#EEF2F6] flex items-center justify-center mb-6 text-[#C8D8E8]">
                  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
                    <rect x="8" y="12" width="32" height="28" rx="2" />
                    <path d="M16 12V9a2 2 0 012-2h12a2 2 0 012 2v3" />
                    <line x1="24" y1="22" x2="24" y2="32" />
                    <line x1="19" y1="27" x2="29" y2="27" />
                  </svg>
                </div>
                <h3 className="font-display font-bold text-[#0E2A47] text-xl mb-3">No Products Available</h3>
                <p className="text-[#5B6B78] text-sm leading-relaxed mb-8">
                  There are currently no products available under this category. Please check back later or contact us for availability.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={onNavigateCategories}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#F2A71B] hover:bg-[#D4920F] text-[#0E2A47] font-bold text-sm rounded transition-colors duration-150"
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 rotate-180">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Back to Products
                  </button>
                  <a
                    href="https://wa.me/914412345678?text=Hi%2C%20I%27m%20looking%20for%20products%20in%20the%20Wiring%20Accessories%20category."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#0E2A47] text-[#0E2A47] hover:bg-[#0E2A47] hover:text-white font-bold text-sm rounded transition-all duration-150"
                  >
                    Contact Us
                  </a>
                </div>
              </div>
            ) : (
              <>
                <p className="text-[#5B6B78] text-xs font-semibold tracking-widest uppercase mb-5">
                  {subcats.length} {subcats.length === 1 ? 'Model Series' : 'Model Series'} in {categoryLabel}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {subcats.map(sub => {
                    const rep = firstProductForSubcategory(sub)
                    const count = productCountForSubcategory(sub)
                    const isHov = hovered === sub
                    return (
                      <div
                        key={sub}
                        onMouseEnter={() => setHovered(sub)}
                        onMouseLeave={() => setHovered(null)}
                        onClick={() => onSelectSubcategory(categoryLabel, sub)}
                        className={`bg-white rounded-xl border overflow-hidden cursor-pointer transition-all duration-200 flex flex-col shadow-sm ${isHov ? 'border-[#F2A71B]/50 shadow-[0_8px_32px_rgba(14,42,71,0.12)] -translate-y-0.5' : 'border-gray-100'}`}
                      >
                        <div className="relative overflow-hidden bg-[#F7F8FA]" style={{ aspectRatio: '4/3' }}>
                          {rep ? (
                            <img
                              src={rep.img}
                              alt={sub}
                              className={`w-full h-full transition-transform duration-500 ${isHov ? 'scale-[1.05]' : 'scale-100'} ${rep.productShot ? 'object-contain p-6' : 'object-cover'}`}
                              style={{ background: rep.imgBg }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#C8D8E8]">{icon}</div>
                          )}
                          <div className={`absolute top-0 left-0 right-0 h-0.5 bg-[#F2A71B] transition-opacity duration-200 ${isHov ? 'opacity-100' : 'opacity-0'}`} />
                          {rep && (
                            <div className="absolute top-3 left-3">
                              <span className="px-2 py-0.5 bg-[#0E2A47]/85 text-[#F2A71B] text-[9.5px] font-bold rounded tracking-wide">
                                {rep.protectionTypes[0]}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="p-4 flex flex-col flex-1">
                          <h3 className="font-display font-bold text-[#0E2A47] text-sm leading-snug mb-1">{sub}</h3>
                          <p className="text-[#8DA5BE] text-[10.5px] mb-3 flex-1">
                            {count} {count === 1 ? 'product variant' : 'product variants'}
                          </p>
                          <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                            <span className={`text-xs font-bold flex items-center gap-1 transition-colors duration-150 ${isHov ? 'text-[#F2A71B]' : 'text-[#5B6B78]'}`}>
                              View Details <ArrowRight className={`transition-transform duration-150 ${isHov ? 'translate-x-0.5' : ''}`} />
                            </span>
                            <span className="text-[9.5px] text-[#8DA5BE] uppercase tracking-wide">{categoryLabel}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Related Products Section ─────────────────────────────────────────────────

function RelatedProductsSection({
  categoryLabel,
  activeSubcats,
  onSelectProduct,
}: {
  categoryLabel: string
  activeSubcats: string[]
  onSelectProduct: (categoryLabel: string, subcategory: string, productId: string) => void
}) {
  const group = getPublicData().groups.find(g => g.label === categoryLabel)
  const relatedSubcats = (group?.subcategories ?? []).filter(
    s => !activeSubcats.includes(s) && productCountForSubcategory(s) > 0
  )

  const related = relatedSubcats.flatMap(sub =>
    getPublicData().products.filter(p => p.category === sub).slice(0, 2)
  ).slice(0, 8)

  if (related.length === 0) return null

  return (
    <div className="mt-14 pt-10 border-t border-gray-200">
      <h2 className="font-display font-bold text-[#0E2A47] text-xl mb-8">Related Products</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">
        {related.map(p => {
          const sub = p.category
          return (
            <div
              key={p.id}
              onClick={() => onSelectProduct(categoryLabel, sub, p.id)}
              className="group bg-white border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:border-[#F2A71B]/60 hover:shadow-[0_4px_24px_rgba(14,42,71,0.10)] transition-all duration-200 flex flex-col"
            >
              {/* Image */}
              <div
                className="relative flex items-center justify-center p-6"
                style={{ background: p.imgBg ?? '#F7F8FA', aspectRatio: '1/1' }}
              >
                <img
                  src={p.img}
                  alt={p.name}
                  className={`w-full h-full transition-transform duration-300 group-hover:scale-[1.05] ${p.productShot ? 'object-contain' : 'object-cover'}`}
                />
              </div>

              {/* Name + button */}
              <div className="flex flex-col items-center text-center px-4 py-4 gap-3 flex-1">
                <p className="font-display font-semibold text-[#0E2A47] text-sm leading-snug line-clamp-2 flex-1">{p.name}</p>
                <span className="w-full py-2 bg-[#F2A71B] group-hover:bg-[#D4920F] text-[#0E2A47] font-bold text-xs tracking-wide rounded-lg transition-colors duration-150 block">
                  View Details
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Level 3: Product Listing ─────────────────────────────────────────────────

const PAGE_SIZE = 9

interface ProductListingProps {
  viewState: { level: 'products'; categoryLabel: string; subcategory: string }
  onSelectProduct: (categoryLabel: string, subcategory: string, productId: string) => void
  enquiryList: string[]
  onToggleEnquiry: (id: string) => void
  onNavigateHome: () => void
  onNavigateCategories: () => void
  onNavigateSubcategories: (label: string) => void
  onSelectSubcategory: (categoryLabel: string, sub: string) => void
}

function ProductListing({
  viewState, onSelectProduct,
  enquiryList, onToggleEnquiry, onNavigateHome, onNavigateCategories, onNavigateSubcategories,
  onSelectSubcategory,
}: ProductListingProps) {
  const [mobileSeriesOpen, setMobileSeriesOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [sortBy, setSortBy] = useState<'default' | 'name' | 'category'>('default')

  const { categoryLabel, subcategory } = viewState

  const filtered = useMemo(() => {
    const base = getPublicData().products.filter(p => p.category === subcategory)
    if (sortBy === 'name') return [...base].sort((a, b) => a.name.localeCompare(b.name))
    if (sortBy === 'category') return [...base].sort((a, b) => a.category.localeCompare(b.category))
    return base
  }, [subcategory, sortBy, getPublicData()])

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  const subcatsForCategory = getPublicData().groups.find(g => g.label === categoryLabel)?.subcategories ?? []

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* Fixed nav clearance + breadcrumb strip */}
      <div className="pt-16">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 h-10 flex items-center">
            <nav className="flex items-center gap-1.5 text-xs flex-wrap">
              <button onClick={onNavigateHome} className="text-[#5B6B78] hover:text-[#F2A71B] transition-colors font-medium">Home</button>
              <ChevronRight className="text-gray-300" />
              <button onClick={onNavigateCategories} className="text-[#5B6B78] hover:text-[#F2A71B] transition-colors font-medium">Products</button>
              <ChevronRight className="text-gray-300" />
              <button onClick={() => onNavigateSubcategories(categoryLabel)} className="text-[#5B6B78] hover:text-[#F2A71B] transition-colors font-medium">{categoryLabel}</button>
              <ChevronRight className="text-gray-300" />
              <span className="text-[#0E2A47] font-semibold">{subcategory}</span>
            </nav>
          </div>
        </div>
      </div>

      {/* Page header */}
      <div className="bg-[#0E2A47]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-8 pb-10">
          <h1 className="font-display font-bold text-white text-3xl md:text-4xl mb-2">{subcategory}</h1>
          <p className="text-[#8DA5BE] text-sm max-w-2xl leading-relaxed">
            {CATEGORY_TAGLINES[categoryLabel] ?? `Explosion-proof ${categoryLabel.toLowerCase()} for hazardous area installations.`}
          </p>
        </div>
      </div>

      {/* Tip bar */}
      <div className="bg-[#163A5F] border-b border-[#1C4570]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-2.5 flex items-center gap-2.5">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-[#F2A71B] flex-shrink-0">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-[#8DA5BE] text-xs">
            <span className="text-white font-semibold">Click the product image</span> inside the detail view to open the manufacturer's datasheet PDF in a new tab.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        {/* Mobile series toggle */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setMobileSeriesOpen(v => !v)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-[#0E2A47] shadow-sm"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-[#F2A71B]">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h4a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            Series
          </button>
          {mobileSeriesOpen && (
            <div className="mt-3">
              <CategoryScopedSidebar
                categoryLabel={categoryLabel}
                subcats={subcatsForCategory}
                activeSubcat={subcategory}
                onSelectSubcategory={onSelectSubcategory}
              />
            </div>
          )}
        </div>

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <div className="hidden lg:block">
            <CategoryScopedSidebar
              categoryLabel={categoryLabel}
              subcats={subcatsForCategory}
              activeSubcat={subcategory}
              onSelectSubcategory={onSelectSubcategory}
            />
          </div>

          {/* Main grid */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <p className="text-sm text-[#5B6B78]">
                Showing <span className="font-semibold text-[#0E2A47]">{Math.min(visibleCount, filtered.length)}</span> of{' '}
                <span className="font-semibold text-[#0E2A47]">{filtered.length}</span> products
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#5B6B78]">Sort:</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as typeof sortBy)}
                  className="text-xs border border-gray-200 rounded px-2 py-1.5 text-[#0E2A47] font-medium bg-white focus:outline-none focus:border-[#F2A71B]"
                >
                  <option value="default">Default</option>
                  <option value="name">Name A–Z</option>
                  <option value="category">Category</option>
                </select>
              </div>
            </div>

            {visible.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-[#EEF2F6] flex items-center justify-center mb-4">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#5B6B78" strokeWidth="1.5" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
                <h3 className="font-display font-bold text-[#0E2A47] text-lg mb-2">No products available</h3>
                <p className="text-[#5B6B78] text-sm mb-4">No products found in this series.</p>
                <button onClick={onNavigateSubcategories.bind(null, categoryLabel)} className="px-4 py-2 bg-[#F2A71B] text-[#0E2A47] text-sm font-bold rounded">Back to {categoryLabel}</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {visible.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    inEnquiry={enquiryList.includes(product.id)}
                    onViewDetails={() => onSelectProduct(categoryLabel, subcategory, product.id)}
                    onToggleEnquiry={() => onToggleEnquiry(product.id)}
                  />
                ))}
              </div>
            )}

            {hasMore && (
              <div className="mt-10 text-center">
                <button
                  onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                  className="inline-flex items-center gap-2 px-8 py-3 border-2 border-[#F2A71B] text-[#0E2A47] font-bold text-sm rounded hover:bg-[#F2A71B] transition-all duration-150"
                >
                  Load More Products
                  <span className="text-[#5B6B78] text-xs font-normal">({filtered.length - visibleCount} remaining)</span>
                </button>
              </div>
            )}

            <RelatedProductsSection
              categoryLabel={categoryLabel}
              activeSubcats={[subcategory]}
              onSelectProduct={onSelectProduct}
            />

            <div className="mt-14 bg-[#0E2A47] rounded-xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h3 className="font-display font-bold text-white text-lg mb-1">Can't find what you need?</h3>
                <p className="text-[#8DA5BE] text-sm">Our technical team can source or specify any Ex-proof product — custom configurations available.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a href="https://wa.me/914412345678?text=Hi%2C%20I%20need%20technical%20help%20with%20an%20explosion-proof%20product%20selection." target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-[#F2A71B] hover:bg-[#D4920F] text-[#0E2A47] font-bold text-sm rounded whitespace-nowrap transition-colors">Talk to an Engineer</a>
                <a href="https://wa.me/914412345678" className="px-5 py-2.5 border border-[#F2A71B]/40 text-[#F2A71B] hover:border-[#F2A71B] font-semibold text-sm rounded whitespace-nowrap transition-colors">WhatsApp Us</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main ProductsPage ────────────────────────────────────────────────────────

export default function ProductsPage({ onNavigate, enquiryList, onToggleEnquiry, onClearEnquiry, onViewEnquiry }: Props) {
  usePublicData()
  const [viewState, setViewState] = useState<ProductViewLevel>({ level: 'categories' })

  const gotoCategories = () => {
    setViewState({ level: 'categories' })
    window.scrollTo(0, 0)
  }

  const gotoSubcategories = (categoryLabel: string) => {
    setViewState({ level: 'subcategories', categoryLabel })
    window.scrollTo(0, 0)
  }

  const gotoProducts = (categoryLabel: string, subcategory: string) => {
    setViewState({ level: 'products', categoryLabel, subcategory })
    window.scrollTo(0, 0)
  }

  const gotoProduct = (categoryLabel: string, subcategory: string, productId: string) => {
    setViewState({ level: 'product-detail', categoryLabel, subcategory, productId })
    window.scrollTo(0, 0)
  }

  const enquiryProducts = useMemo(() => getPublicData().products.filter(p => enquiryList.includes(p.id)), [enquiryList, getPublicData()])

  return (
    <>
      {viewState.level === 'categories' && (
        <CategoriesGrid
          onNavigateHome={() => onNavigate('home')}
          onSelectCategory={gotoSubcategories}
        />
      )}

      {viewState.level === 'subcategories' && (
        <SubcategoriesPage
          categoryLabel={viewState.categoryLabel}
          onNavigateHome={() => onNavigate('home')}
          onNavigateCategories={gotoCategories}
          onSelectCategory={gotoSubcategories}
          onSelectSubcategory={gotoProducts}
        />
      )}

      {viewState.level === 'products' && (
        <ProductListing
          viewState={viewState}
          onSelectProduct={gotoProduct}
          enquiryList={enquiryList}
          onToggleEnquiry={onToggleEnquiry}
          onNavigateHome={() => onNavigate('home')}
          onNavigateCategories={gotoCategories}
          onNavigateSubcategories={gotoSubcategories}
          onSelectSubcategory={gotoProducts}
        />
      )}

      {viewState.level === 'product-detail' && (() => {
        const product = getPublicData().products.find(p => p.id === viewState.productId)
        if (!product) return null
        return (
          <ProductDetailPage
            product={product}
            categoryLabel={viewState.categoryLabel}
            subcategory={viewState.subcategory}
            inEnquiry={enquiryList.includes(product.id)}
            onToggleEnquiry={() => onToggleEnquiry(product.id)}
            onNavigateHome={() => onNavigate('home')}
            onNavigateCategories={gotoCategories}
            onNavigateSubcategories={gotoSubcategories}
            onNavigateProducts={gotoProducts}
            onQuote={() => {
              setQuoteContext({ product: { name: product.name, code: product.catNo } })
              onNavigate('quotation')
            }}
          />
        )
      })()}

      <EnquiryBar count={enquiryList.length} products={enquiryProducts} onClear={onClearEnquiry} onViewCart={onViewEnquiry} />
    </>
  )
}
