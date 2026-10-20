import type { Page } from '../App'
import { INDUSTRIES } from '../data/industries'

const TK = {
  navy: '#071829',
  card: '#0E2236',
  border: '#1E3A52',
  accent: '#F2A71B',
  red: '#E53935',
  textPrimary: '#FFFFFF',
  textSecondary: '#AABDD0',
  textMuted: '#5B6B78',
}

interface Props {
  onNavigate: (page: Page, industrySlug?: string) => void
}

function ArrowRight() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
    </svg>
  )
}

function IndustryCard({ industry, onNavigate }: { industry: typeof INDUSTRIES[0]; onNavigate: Props['onNavigate'] }) {
  return (
    <div
      className="group relative flex flex-col overflow-hidden cursor-pointer"
      style={{ background: TK.card, border: `1px solid ${TK.border}`, borderRadius: 2 }}
      onClick={() => onNavigate('industry', industry.slug)}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: 220 }}>
        <img
          src={industry.cardImg}
          alt={industry.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{ background: 'linear-gradient(to top, rgba(7,24,41,0.85) 0%, rgba(7,24,41,0.3) 60%, transparent 100%)' }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div
            className="text-[8px] font-bold tracking-[0.2em] uppercase mb-1"
            style={{ color: TK.accent }}
          >
            Industry
          </div>
          <h3 className="text-lg font-bold text-white leading-tight">{industry.name}</h3>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 gap-4">
        <p className="text-sm leading-relaxed flex-1" style={{ color: TK.textSecondary }}>
          {industry.shortDesc}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {industry.productGroupLabels.slice(0, 3).map(label => (
              <span
                key={label}
                className="text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded"
                style={{ background: 'rgba(255,255,255,0.05)', color: TK.textMuted, border: `1px solid ${TK.border}` }}
              >
                {label}
              </span>
            ))}
            {industry.productGroupLabels.length > 3 && (
              <span
                className="text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded"
                style={{ background: 'rgba(255,255,255,0.05)', color: TK.textMuted, border: `1px solid ${TK.border}` }}
              >
                +{industry.productGroupLabels.length - 3} more
              </span>
            )}
          </div>
          <span
            className="flex items-center gap-1.5 text-xs font-semibold transition-colors duration-200 group-hover:text-[#E53935] flex-shrink-0 ml-3"
            style={{ color: TK.accent }}
          >
            View <ArrowRight />
          </span>
        </div>
      </div>
    </div>
  )
}

export default function IndustriesPage({ onNavigate }: Props) {
  return (
    <div style={{ background: TK.navy, minHeight: '100vh' }}>
      {/* Hero */}
      <section
        className="relative flex items-center justify-center text-center"
        style={{ paddingTop: 120, paddingBottom: 72, borderBottom: `1px solid ${TK.border}` }}
      >
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <div
            className="inline-block text-[9px] font-bold tracking-[0.25em] uppercase px-3 py-1.5 rounded mb-5"
            style={{ background: 'rgba(242,167,27,0.1)', color: TK.accent, border: `1px solid rgba(242,167,27,0.25)` }}
          >
            Industries We Serve
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-5" style={{ color: TK.textPrimary, lineHeight: 1.1 }}>
            Explosion-Proof Solutions for<br />
            <span style={{ color: TK.accent }}>Every Hazardous Industry</span>
          </h1>
          <p className="text-base md:text-lg leading-relaxed mb-8" style={{ color: TK.textSecondary }}>
            CND Hi-Tech supplies certified flameproof and explosion-proof electrical equipment for
            India's most demanding industrial environments. Select your industry below to see relevant
            solutions and product recommendations.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {['CIMFR Certified', 'PESO Approved', 'BIS Marked', 'IS/IEC 60079'].map(tag => (
              <span
                key={tag}
                className="text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded"
                style={{ background: 'rgba(255,255,255,0.05)', color: TK.textMuted, border: `1px solid ${TK.border}` }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Industry grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {INDUSTRIES.map(industry => (
            <IndustryCard key={industry.slug} industry={industry} onNavigate={onNavigate} />
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <section
        className="mx-4 md:mx-6 lg:mx-8 mb-16 rounded-sm"
        style={{ background: TK.card, border: `1px solid ${TK.border}`, padding: '48px 40px' }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-2" style={{ color: TK.textPrimary }}>
              Not Sure Which Products You Need?
            </h2>
            <p className="text-sm" style={{ color: TK.textSecondary }}>
              Our technical team can recommend the right certified equipment for your specific hazardous area classification.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <button
              onClick={() => onNavigate('quotation')}
              className="px-6 py-2.5 text-sm font-bold text-white transition-colors duration-150"
              style={{ background: TK.red }}
              onMouseEnter={e => (e.currentTarget.style.background = '#C62828')}
              onMouseLeave={e => (e.currentTarget.style.background = TK.red)}
            >
              Get a Quote
            </button>
            <button
              onClick={() => onNavigate('products')}
              className="px-6 py-2.5 text-sm font-semibold transition-all duration-150"
              style={{ border: `1px solid ${TK.border}`, color: TK.textSecondary }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = TK.accent; e.currentTarget.style.color = TK.accent }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = TK.border; e.currentTarget.style.color = TK.textSecondary }}
            >
              Browse All Products
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
