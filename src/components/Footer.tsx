import { LogoImage } from './Logo'
import type { Page } from '../App'

interface Props {
  onNavigate: (page: Page, industrySlug?: string) => void
  logoColorFilter?: string
}

type FooterLink = { label: string; page?: Page; section?: string; industrySlug?: string }

const FOOTER_COLS: { heading: string; links: FooterLink[]; showAllProducts?: boolean }[] = [
  {
    heading: 'About',
    links: [
      { label: 'Our Story', page: 'about', section: 'our-story' },
      { label: 'Careers', page: 'about', section: 'careers' },
      { label: 'Quality Policy', page: 'about', section: 'quality' },
      { label: 'HSE Commitment', page: 'about', section: 'hse' },
    ],
  },
  {
    heading: 'Products',
    links: [
      { label: 'Light Fittings', page: 'products' },
      { label: 'Junction Boxes', page: 'products' },
      { label: 'Control Stations', page: 'products' },
      { label: 'Plug & Sockets', page: 'products' },
      { label: 'Switches', page: 'products' },
    ],
    showAllProducts: true,
  },
  {
    heading: 'Industries',
    links: [
      { label: 'Paints', page: 'industry', industrySlug: 'paints' },
      { label: 'Automobiles', page: 'industry', industrySlug: 'automobiles' },
      { label: 'Power Plants', page: 'industry', industrySlug: 'power-plants' },
      { label: 'Chemicals', page: 'industry', industrySlug: 'chemicals' },
    ],
  },
  {
    heading: 'Contact',
    links: [
      { label: 'Request a Quote', page: 'contact' },
      { label: 'Technical Support', page: 'contact' },
      { label: 'Distributor Enquiry', page: 'contact' },
      { label: 'Chennai Office', page: 'contact' },
      { label: 'Download Catalog', page: 'contact' },
    ],
  },
]

function handleLinkClick(link: FooterLink, onNavigate: (p: Page, industrySlug?: string) => void) {
  if (link.page) {
    onNavigate(link.page, link.industrySlug)
    if (link.section) {
      setTimeout(() => document.getElementById(link.section!)?.scrollIntoView({ behavior: 'smooth' }), 80)
    }
  }
}

export function Footer({ onNavigate, logoColorFilter }: Props) {
  const bg = '#071829'
  const divider = '#1C4570'
  return (
    <footer className="text-[#8DA5BE]" style={{ background: bg, transition: 'background 0.45s ease' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-14">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="mb-5 inline-block">
              <div className="px-3 py-2">
                <LogoImage height={38} colorFilter={logoColorFilter} />
              </div>
            </div>
            <p className="text-xs leading-relaxed mb-4 text-[#5B6B78]">
              India's trusted source for explosion-proof and flameproof luminaires and instrumentation for hazardous areas.
            </p>
            <address className="not-italic mb-5 space-y-1">
              <a
                href="https://maps.app.goo.gl/Cy4rwveYGnvVLDxy5?g_st=aw"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-[#5B6B78] hover:text-[#E53935] transition-colors duration-150 leading-relaxed block"
              >
                #1, Shree SivaGuru Illam, New No.16,<br />West Road, West C.I.T Nagar,<br />Chennai, Tamil Nadu 600035
              </a>
              <a href="tel:+919444022338" className="text-[11px] text-[#8DA5BE] hover:text-[#E53935] transition-colors duration-150 block">+91 94440 22338</a>
              <a href="mailto:cndhitech.india@gmail.com" className="text-[11px] text-[#8DA5BE] hover:text-[#E53935] transition-colors duration-150 block">cndhitech.india@gmail.com</a>
            </address>
            <div className="flex flex-wrap gap-2 mb-6">
              {['Ex d', 'Ex db', 'Ex tb', 'IP65', 'IP66'].map(c => (
                <span key={c} className="px-2 py-0.5 border border-white/20 text-white/50 text-[9px] font-bold rounded tracking-widest">
                  {c}
                </span>
              ))}
            </div>
            <div className="flex gap-3">
              {['M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z',
                'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z',
              ].map((d, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded flex items-center justify-center text-[#5B6B78] hover:text-[#E53935] hover:border-[#E53935]/40 transition-colors duration-150" style={{ border: `1px solid ${divider}` }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {FOOTER_COLS.map(col => (
            <div key={col.heading}>
              <h4 className="font-display font-semibold text-white text-xs mb-5 tracking-widest uppercase">
                {col.heading}
              </h4>
              <ul className="space-y-3">
                {col.links.map(link => (
                  <li key={link.label}>
                    <button
                      onClick={() => handleLinkClick(link, onNavigate)}
                      className="text-[11px] text-[#5B6B78] hover:text-[#E53935] transition-colors duration-150 text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
                {col.showAllProducts && (
                  <li className="pt-1">
                    <button
                      onClick={() => onNavigate('products')}
                      className="inline-flex items-center gap-1 text-[11px] text-[#E53935] hover:text-[#C62828] font-semibold transition-colors duration-150"
                    >
                      All Products
                      <svg viewBox="0 0 12 12" fill="currentColor" className="w-2.5 h-2.5">
                        <path fillRule="evenodd" d="M6.293 3.293a1 1 0 011.414 0l2 2a1 1 0 010 1.414l-2 2a1 1 0 01-1.414-1.414L7.086 7H3a1 1 0 110-2h4.086L6.293 4.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-3" style={{ borderTop: `1px solid ${divider}` }}>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <p className="text-[10px] text-[#3D5570]">
              © {new Date().getFullYear()} CND Hitech Co. All rights reserved.
            </p>
            <span className="hidden sm:block text-[#1C4570]">·</span>
            <a
              href="https://datadriven-services.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-[#E53935] hover:text-[#C62828] transition-colors duration-150"
            >
              Design &amp; Developed by DataDriven
            </a>
          </div>
          <div className="flex items-center gap-5">
            {['Privacy Policy', 'Terms of Use', 'Sitemap'].map(l => (
              <a key={l} href="#" className="text-[10px] text-[#3D5570] hover:text-[#E53935] transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
