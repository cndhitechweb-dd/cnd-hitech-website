import { useState, useEffect, useRef } from 'react'
import { LogoImage } from './Logo'
import { usePublicData } from '../data/store'
import type { Page } from '../App'

interface Props {
  currentPage: Page
  onNavigate: (page: Page, industrySlug?: string) => void
  onNavigateToProduct: (productId: string) => void
  enquiryCount?: number
  logoColorFilter?: string
}

const NAV_LINKS: { label: string; page?: Page; section?: string }[] = [
  { label: 'Products', page: 'products' },
  { label: 'Industries', page: 'industries' },
  { label: 'About Us', page: 'about' },
  { label: 'Clients', section: 'clients' },
  { label: 'Contact', page: 'contact' },
]

function scrollTo(section: string) {
  document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' })
}

export function Header({ currentPage, onNavigate, onNavigateToProduct, enquiryCount = 0, logoColorFilter }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)
  const publicData = usePublicData()

  const searchResults = searchQuery.trim().length > 1
    ? publicData.products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.catNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : []

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (showSearch) {
      setTimeout(() => searchRef.current?.focus(), 50)
    } else {
      setSearchQuery('')
    }
  }, [showSearch])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowSearch(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const navBg = scrolled ? '#071829' : 'rgba(7,24,41,0.96)'
  const borderColor = '#1C4570'

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm transition-all duration-300"
      style={{
        background: navBg,
        boxShadow: scrolled ? '0 2px 32px rgba(0,0,0,0.5)' : 'none',
        transition: 'background 0.45s ease, box-shadow 0.3s ease',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => onNavigate('home')} className="flex items-center group">
            <div className="px-3 py-1.5">
              <LogoImage height={38} colorFilter={logoColorFilter} />
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map(link => (
              <button
                key={link.label}
                onClick={() => {
                  if (link.page) {
                    onNavigate(link.page)
                  } else if (link.section) {
                    if (currentPage !== 'home') {
                      onNavigate('home')
                      setTimeout(() => scrollTo(link.section!), 80)
                    } else {
                      scrollTo(link.section)
                    }
                  }
                }}
                className={`text-sm font-medium tracking-wide transition-colors duration-150 ${
                  link.page && currentPage === link.page
                    ? 'text-[#E53935]'
                    : 'text-[#AABDD0] hover:text-[#E53935]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Search icon */}
            <button
              onClick={() => setShowSearch(v => !v)}
              className={`transition-colors p-1.5 ${showSearch ? 'text-[#F2A71B]' : 'text-white/50 hover:text-white'}`}
              aria-label="Search products"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
              </svg>
            </button>
            {enquiryCount > 0 && (
              <button
                onClick={() => onNavigate('enquiry')}
                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded text-white text-xs font-medium transition-colors"
                style={{ background: '#1C4570' }}
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-white/70">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
                Enquiry Cart
                <span className="w-4 h-4 rounded-full bg-[#E53935] text-white text-[9px] font-bold flex items-center justify-center">
                  {enquiryCount}
                </span>
              </button>
            )}
            <a
              href="https://wa.me/919994233119"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#25D366]/60 text-[#25D366] hover:bg-[#25D366] hover:text-white text-xs font-semibold transition-all duration-150"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
            <button
              onClick={() => onNavigate('quotation')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#E53935] hover:bg-[#C62828] text-white text-xs font-bold tracking-wide transition-colors duration-150"
            >
              Get a Quote
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                <path fillRule="evenodd" d="M8.293 4.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L9.586 9H4a1 1 0 010-2h5.586L8.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(v => !v)}
            className="lg:hidden text-white p-1.5 rounded"
            aria-label="Toggle menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
              {mobileOpen ? (
                <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
              ) : (
                <><line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" /></>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden py-4 space-y-1" style={{ borderTop: `1px solid ${borderColor}` }}>
            {NAV_LINKS.map(link => (
              <button
                key={link.label}
                onClick={() => {
                  if (link.page) onNavigate(link.page)
                  else if (link.section) {
                    if (currentPage !== 'home') { onNavigate('home'); setTimeout(() => scrollTo(link.section!), 80) }
                    else scrollTo(link.section)
                  }
                  setMobileOpen(false)
                }}
                className={`w-full text-left text-sm font-medium py-2.5 px-1 transition-colors ${
                  link.page && currentPage === link.page ? 'text-[#E53935]' : 'text-[#AABDD0]'
                }`}
                style={{ borderBottom: `1px solid ${borderColor}50` }}
              >
                {link.label}
              </button>
            ))}
            <div className="pt-4 flex flex-col gap-2">
              <button onClick={() => { onNavigate('quotation'); setMobileOpen(false) }} className="text-center px-4 py-2.5 bg-[#E53935] text-white text-sm font-bold rounded w-full">
                Get a Quote
              </button>
              <a href="https://wa.me/919994233119" className="text-center px-4 py-2.5 border border-[#25D366]/60 text-[#25D366] text-sm font-semibold rounded">
                Chat on WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Search panel */}
      {showSearch && (
        <div
          className="border-t"
          style={{ borderColor: '#1C4570', background: '#071829' }}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-3 relative">
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0" style={{ color: '#5B6B78' }}>
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
              </svg>
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products by name or catalogue number..."
                className="flex-1 bg-transparent text-sm text-white placeholder-[#5B6B78] outline-none"
                onKeyDown={e => {
                  if (e.key === 'Enter' && searchResults.length > 0) {
                    onNavigateToProduct(searchResults[0].id)
                    setShowSearch(false)
                  }
                }}
              />
              <button onClick={() => setShowSearch(false)} className="text-[#5B6B78] hover:text-white transition-colors">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>

            {/* Search results dropdown */}
            {searchResults.length > 0 && (
              <div
                className="absolute left-0 right-0 top-full mt-1 z-50 rounded-b-lg overflow-hidden shadow-xl"
                style={{ background: '#0E2236', border: '1px solid #1E3A52', borderTop: 'none' }}
              >
                {searchResults.map(p => (
                  <button
                    key={p.catNo}
                    onClick={() => { onNavigateToProduct(p.id); setShowSearch(false) }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#1C4570]/40 transition-colors"
                  >
                    {p.img ? (
                      <img src={p.img} alt="" className="w-8 h-8 object-contain flex-shrink-0 rounded" style={{ background: '#071829' }} />
                    ) : (
                      <div className="w-8 h-8 rounded flex-shrink-0 flex items-center justify-center" style={{ background: '#071829' }}>
                        <svg viewBox="0 0 16 16" fill="none" stroke="#1E3A52" strokeWidth="1" className="w-4 h-4"><rect x="1" y="1" width="14" height="14" rx="1"/></svg>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-white truncate">{p.shortName}</div>
                      <div className="text-[10px] text-[#5B6B78]">{p.catNo} · {p.category}</div>
                    </div>
                    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 flex-shrink-0 text-[#5B6B78]">
                      <path fillRule="evenodd" d="M8.293 4.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L9.586 9H4a1 1 0 010-2h5.586L8.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                ))}
                <div className="px-4 py-2.5 border-t" style={{ borderColor: '#1E3A52' }}>
                  <button
                    onClick={() => { onNavigate('products'); setShowSearch(false) }}
                    className="text-xs font-semibold transition-colors"
                    style={{ color: '#F2A71B' }}
                  >
                    View all matching products →
                  </button>
                </div>
              </div>
            )}

            {searchQuery.trim().length > 1 && searchResults.length === 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 z-50 px-4 py-3 text-xs text-[#5B6B78] rounded-b-lg"
                style={{ background: '#0E2236', border: '1px solid #1E3A52', borderTop: 'none' }}>
                No products found for "{searchQuery}" — <button onClick={() => { onNavigate('products'); setShowSearch(false) }} className="text-[#F2A71B] font-semibold">Browse all products</button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
