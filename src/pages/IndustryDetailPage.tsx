import type { Page } from '../App'
import { INDUSTRIES, getIndustryBySlug } from '../data/industries'
import { industryProducts, usePublicData, setQuoteContext } from '../data/store'

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
  industrySlug: string
}

function IconBox({ path }: { path: string }) {
  return (
    <div
      className="flex items-center justify-center w-10 h-10 rounded flex-shrink-0"
      style={{ background: 'rgba(242,167,27,0.1)', border: `1px solid rgba(242,167,27,0.2)` }}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" style={{ color: TK.accent }}>
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
      </svg>
    </div>
  )
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0">
      <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 010-1.06z" clipRule="evenodd" />
    </svg>
  )
}

function ArrowRight() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
    </svg>
  )
}

export default function IndustryDetailPage({ onNavigate, industrySlug }: Props) {
  usePublicData()
  const industry = getIndustryBySlug(industrySlug)

  if (!industry) {
    return (
      <div style={{ background: TK.navy, minHeight: '100vh', paddingTop: 100 }} className="flex flex-col items-center justify-center text-center gap-4 px-4">
        <h1 className="text-2xl font-bold" style={{ color: TK.textPrimary }}>Industry not found</h1>
        <button onClick={() => onNavigate('industries')} className="text-sm px-5 py-2.5 font-semibold" style={{ background: TK.red, color: '#fff' }}>
          Back to Industries
        </button>
      </div>
    )
  }

  // Get products relevant to this industry
  const relatedProducts = industryProducts(industry.slug).slice(0, 8)

  const otherIndustries = INDUSTRIES.filter(i => i.slug !== industry.slug).slice(0, 4)

  return (
    <div style={{ background: TK.navy, minHeight: '100vh' }}>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative flex items-end overflow-hidden" style={{ minHeight: 520, paddingTop: 80 }}>
        <img
          src={industry.heroImg}
          alt={industry.name}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center 40%' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(105deg, rgba(7,24,41,0.97) 0%, rgba(7,24,41,0.88) 55%, rgba(7,24,41,0.55) 100%)' }}
        />

        <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 w-full pb-14 pt-16">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 mb-6 text-xs" style={{ color: TK.textMuted }}>
            <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">Home</button>
            <ChevronRight />
            <button onClick={() => onNavigate('industries')} className="hover:text-white transition-colors">Industries</button>
            <ChevronRight />
            <span style={{ color: TK.textSecondary }}>{industry.name}</span>
          </nav>

          <div className="max-w-2xl">
            <div
              className="inline-block text-[9px] font-bold tracking-[0.25em] uppercase px-3 py-1.5 mb-4 rounded"
              style={{ background: 'rgba(242,167,27,0.12)', color: TK.accent, border: `1px solid rgba(242,167,27,0.3)` }}
            >
              {industry.eyebrow}
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4" style={{ color: TK.textPrimary }}>
              {industry.heroHeading}
            </h1>
            <p className="text-base md:text-lg leading-relaxed mb-8" style={{ color: TK.textSecondary }}>
              {industry.heroSub}
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => { setQuoteContext({ industry: industry.name }); onNavigate('quotation') }}
                className="px-6 py-2.5 text-sm font-bold text-white transition-colors duration-150"
                style={{ background: TK.red }}
                onMouseEnter={e => (e.currentTarget.style.background = '#C62828')}
                onMouseLeave={e => (e.currentTarget.style.background = TK.red)}
              >
                Request a Quote
              </button>
              <button
                onClick={() => onNavigate('products')}
                className="px-6 py-2.5 text-sm font-semibold transition-all duration-150"
                style={{ border: `1px solid rgba(255,255,255,0.2)`, color: TK.textSecondary }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = TK.accent; e.currentTarget.style.color = TK.accent }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = TK.textSecondary }}
              >
                Browse Products
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── About Industry ───────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div
              className="inline-block text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1 mb-4 rounded"
              style={{ background: 'rgba(242,167,27,0.08)', color: TK.accent, border: `1px solid rgba(242,167,27,0.2)` }}
            >
              About the Industry
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6 leading-tight" style={{ color: TK.textPrimary }}>
              {industry.aboutHeading}
            </h2>
            <div className="space-y-4">
              {industry.aboutBody.map((para, i) => (
                <p key={i} className="text-sm leading-relaxed" style={{ color: TK.textSecondary }}>
                  {para}
                </p>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {['Ex d (Flameproof)', 'Ex e (Increased Safety)', 'Ex tb (Dust)', 'IP65 / IP66', 'IS/IEC 60079'].map(tag => (
                <span
                  key={tag}
                  className="text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded"
                  style={{ background: 'rgba(255,255,255,0.04)', color: TK.textMuted, border: `1px solid ${TK.border}` }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="relative rounded-sm overflow-hidden" style={{ height: 380 }}>
            <img
              src={industry.aboutImg}
              alt={`${industry.name} facility`}
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(7,24,41,0.5) 0%, transparent 60%)' }}
            />
          </div>
        </div>
      </section>

      {/* ── Applications ─────────────────────────────────────────── */}
      <section style={{ background: TK.card, borderTop: `1px solid ${TK.border}`, borderBottom: `1px solid ${TK.border}` }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <div
              className="inline-block text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1 mb-4 rounded"
              style={{ background: 'rgba(242,167,27,0.08)', color: TK.accent, border: `1px solid rgba(242,167,27,0.2)` }}
            >
              Application Areas
            </div>
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: TK.textPrimary }}>
              Where Our Equipment Is Used
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {industry.applications.map(app => (
              <div
                key={app.title}
                className="p-5 rounded-sm"
                style={{ background: TK.navy, border: `1px solid ${TK.border}` }}
              >
                <div className="flex items-start gap-4">
                  <IconBox path={app.iconPath} />
                  <div>
                    <h3 className="font-semibold text-sm mb-2" style={{ color: TK.textPrimary }}>{app.title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: TK.textSecondary }}>{app.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Suggested Products ───────────────────────────────────── */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div
                className="inline-block text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1 mb-4 rounded"
                style={{ background: 'rgba(242,167,27,0.08)', color: TK.accent, border: `1px solid rgba(242,167,27,0.2)` }}
              >
                Suggested Products
              </div>
              <h2 className="text-2xl md:text-3xl font-bold" style={{ color: TK.textPrimary }}>
                Equipment for {industry.name}
              </h2>
            </div>
            <button
              onClick={() => onNavigate('products')}
              className="flex items-center gap-2 text-sm font-semibold transition-colors duration-150 flex-shrink-0"
              style={{ color: TK.accent }}
              onMouseEnter={e => (e.currentTarget.style.color = TK.red)}
              onMouseLeave={e => (e.currentTarget.style.color = TK.accent)}
            >
              View All Products <ArrowRight />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedProducts.map(product => (
              <div
                key={product.catNo}
                className="group flex flex-col rounded-sm overflow-hidden cursor-pointer transition-all duration-200"
                style={{ background: TK.card, border: `1px solid ${TK.border}` }}
                onClick={() => onNavigate('products')}
                onMouseEnter={e => (e.currentTarget.style.borderColor = TK.accent + '55')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = TK.border)}
              >
                {product.img ? (
                  <div className="relative overflow-hidden" style={{ height: 140, background: '#0a1e30' }}>
                    <img
                      src={product.img}
                      alt={product.shortName}
                      className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center" style={{ height: 140, background: '#0a1e30' }}>
                    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1" className="w-10 h-10" style={{ color: TK.border }}>
                      <rect x="4" y="4" width="32" height="32" rx="2" />
                      <path d="M4 14h32M14 4v10" strokeLinecap="round" />
                    </svg>
                  </div>
                )}
                <div className="p-4 flex flex-col flex-1 gap-2">
                  <div className="text-[9px] font-bold tracking-widest uppercase" style={{ color: TK.accent }}>
                    {product.catNo}
                  </div>
                  <h4 className="text-sm font-semibold leading-tight" style={{ color: TK.textPrimary }}>
                    {product.shortName}
                  </h4>
                  <p className="text-[11px] leading-relaxed" style={{ color: TK.textMuted }}>
                    {product.specSummary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Other Industries ─────────────────────────────────────── */}
      <section style={{ background: TK.card, borderTop: `1px solid ${TK.border}` }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-14">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold" style={{ color: TK.textPrimary }}>Other Industries We Serve</h2>
            <button
              onClick={() => onNavigate('industries')}
              className="flex items-center gap-1.5 text-xs font-semibold transition-colors duration-150"
              style={{ color: TK.accent }}
              onMouseEnter={e => (e.currentTarget.style.color = TK.red)}
              onMouseLeave={e => (e.currentTarget.style.color = TK.accent)}
            >
              All Industries <ArrowRight />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {otherIndustries.map(ind => (
              <div
                key={ind.slug}
                className="group relative overflow-hidden rounded-sm cursor-pointer"
                style={{ height: 160, border: `1px solid ${TK.border}` }}
                onClick={() => onNavigate('industry', ind.slug)}
              >
                <img
                  src={ind.cardImg}
                  alt={ind.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{ background: 'linear-gradient(to top, rgba(7,24,41,0.85) 0%, rgba(7,24,41,0.2) 100%)' }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
                  <h3 className="text-sm font-bold text-white leading-tight">{ind.name}</h3>
                  <span
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ color: TK.accent }}
                  >
                    <ArrowRight />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16">
        <div
          className="rounded-sm p-10 md:p-14 text-center"
          style={{ background: TK.card, border: `1px solid ${TK.border}` }}
        >
          <div
            className="inline-block text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1 mb-4 rounded"
            style={{ background: 'rgba(242,167,27,0.08)', color: TK.accent, border: `1px solid rgba(242,167,27,0.2)` }}
          >
            Get in Touch
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: TK.textPrimary }}>
            Ready to Specify Equipment for Your {industry.name} Facility?
          </h2>
          <p className="text-sm leading-relaxed mb-8 max-w-xl mx-auto" style={{ color: TK.textSecondary }}>
            Our technical team can review your hazardous area classification drawings and recommend the right
            certified products for your specific installation requirements.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => { setQuoteContext({ industry: industry.name }); onNavigate('quotation') }}
              className="px-8 py-3 text-sm font-bold text-white transition-colors duration-150"
              style={{ background: TK.red }}
              onMouseEnter={e => (e.currentTarget.style.background = '#C62828')}
              onMouseLeave={e => (e.currentTarget.style.background = TK.red)}
            >
              Request a Quote
            </button>
            <a
              href="https://wa.me/919994233119"
              className="flex items-center gap-2 px-8 py-3 text-sm font-semibold transition-all duration-150"
              style={{ border: `1px solid rgba(37,211,102,0.4)`, color: '#25D366' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#25D366'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#25D366' }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
