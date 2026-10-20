import { getPublicData, usePublicData } from '../data/store'
import type { Page } from '../App'
import heroBgImg from '../imports/hero-bg.jpg'
import balikaLogoImg from '../imports/baliga-logo.png'

interface Props {
  onNavigate: (page: Page, industrySlug?: string) => void
}

// ── Theme tokens ──────────────────────────────────────────────────────────────

const TK = {
  bg: '#071829',
  bgAlt: '#09203A',
  card: '#0E2236',
  border: '#1E3A52',
  accent: '#F2A71B',
  accentHover: '#D98F0E',
  textPrimary: '#FFFFFF',
  textSub: '#B8C2CC',
  textMuted: '#5B7A93',
}

// ── Data ──────────────────────────────────────────────────────────────────────

const SPEC_PRODUCTS = [
  {
    name: 'Light Fittings',
    group: 'LIGHT FITTINGS',
    desc: 'Flameproof LED high-bay, floodlights, bulk heads and vat lights for all hazardous area classifications',
    tag: 'EX D / EX DB / EX TB',
  },
  {
    name: 'Junction Boxes',
    group: 'JUNCTION BOXES',
    desc: 'GRP & stainless steel junction boxes — lighting, multiway & FRP types for all environments',
    tag: 'EX E / EX D',
  },
  {
    name: 'Control Stations',
    group: 'CONTROL STATIONS',
    desc: 'Push-button, selector & emergency stop stations Ex d and Ex e for field operation',
    tag: 'EX D / EX E',
  },
  {
    name: 'Plug & Sockets',
    group: 'PLUG & SOCKETS',
    desc: 'Industrial explosion-proof connectors 16A–63A, IP66/67 for portable equipment power',
    tag: 'EX E',
  },
  {
    name: 'Switches',
    group: 'SWITCHES',
    desc: 'Flameproof isolating switches and rotary switches for safe power control and distribution',
    tag: 'EX D',
  },
  {
    name: 'All 10 Categories',
    group: null,
    desc: 'Complete explosion-proof product catalog across all hazardous area classifications',
    tag: null,
  },
]

const INDUSTRIES_4 = [
  {
    name: 'Paints',
    slug: 'paints',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&h=480&q=80&fit=crop',
  },
  {
    name: 'Automobiles',
    slug: 'automobiles',
    img: 'https://images.unsplash.com/photo-1716191299980-a6e8827ba10b?w=700&h=480&q=80&fit=crop',
  },
  {
    name: 'Power Plants',
    slug: 'power-plants',
    img: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=700&h=480&q=80&fit=crop',
  },
  {
    name: 'Chemicals',
    slug: 'chemicals',
    img: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=700&h=480&q=80&fit=crop',
  },
]

const TRUSTED_CLIENTS = [
  'ONGC', 'HPCL', 'BPCL', 'Reliance Industries',
  'Indian Oil Corporation', 'GAIL India', 'Essar Oil', 'Shell India', 'TATA',
]

function firstProductInGroup(groupLabel: string) {
  const group = getPublicData().groups.find(g => g.label === groupLabel)
  if (!group) return undefined
  const cats = group.subcategories?.length ? group.subcategories : [groupLabel]
  for (const cat of cats) {
    const p = getPublicData().products.find(pr => pr.category === cat && pr.img)
    if (p) return p
  }
  return undefined
}

// ── Hero Illustration ─────────────────────────────────────────────────────────

function HeroIllustration({ accent }: { accent: string }) {
  const stars: [number, number, number][] = [
    [40, 30, 1.5], [90, 70, 1], [130, 20, 2], [170, 55, 1.2], [210, 25, 1.5],
    [280, 45, 1], [320, 15, 2], [370, 60, 1.2], [420, 30, 1.5], [460, 80, 1],
    [60, 120, 1], [180, 110, 1.5], [340, 90, 1.2], [480, 115, 1],
  ]

  return (
    <svg
      viewBox="0 0 520 580"
      style={{ width: '100%', height: '100%', maxHeight: '600px' }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="ilGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.85" />
          <stop offset="35%" stopColor={accent} stopOpacity="0.35" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ilLens" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF8D0" stopOpacity="1" />
          <stop offset="50%" stopColor={accent} stopOpacity="0.8" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.1" />
        </radialGradient>
        <linearGradient id="ilBeam" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.55" />
          <stop offset="55%" stopColor={accent} stopOpacity="0.10" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ilHousing" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#304E68" />
          <stop offset="100%" stopColor="#162A40" />
        </linearGradient>
        <linearGradient id="ilGlass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0A1E30" />
          <stop offset="100%" stopColor="#071525" />
        </linearGradient>
        <filter id="ilGlowBlur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <filter id="ilSoftBlur">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* Ambient glow behind fixture */}
      <ellipse cx="260" cy="185" rx="200" ry="150" fill="url(#ilGlow)" filter="url(#ilGlowBlur)" opacity="0.45" />

      {/* Stars */}
      {stars.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="white" opacity={0.4 + (i % 3) * 0.2} />
      ))}

      {/* Light beam cone from fixture lens */}
      <polygon points="200,215 30,575 490,575" fill="url(#ilBeam)" opacity="0.55" />
      {/* Secondary inner beam */}
      <polygon points="230,215 120,575 380,575" fill="url(#ilBeam)" opacity="0.2" />

      {/* ─── Floodlight fixture ─── */}

      {/* Mounting pole from top */}
      <rect x="248" y="0" width="24" height="100" rx="4" fill="#14304A" />
      <rect x="242" y="0" width="36" height="14" rx="3" fill="#1C3E58" />
      {/* Pole horizontal cap */}
      <rect x="230" y="95" width="60" height="10" rx="3" fill="#1C3E58" />

      {/* Side mounting brackets */}
      <rect x="152" y="112" width="16" height="70" rx="3" fill="#14304A" />
      <rect x="352" y="112" width="16" height="70" rx="3" fill="#14304A" />
      <rect x="150" y="108" width="22" height="10" rx="2" fill="#1C3E58" />
      <rect x="350" y="108" width="22" height="10" rx="2" fill="#1C3E58" />

      {/* Cooling fins on top of housing */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => (
        <rect
          key={`fin-${i}`}
          x={155 + i * 24}
          y={108}
          width={18}
          height={14}
          rx={2}
          fill={i % 2 === 0 ? '#1E3E58' : '#18344E'}
        />
      ))}

      {/* Main housing body */}
      <rect x="140" y="122" width="240" height="100" rx="10" fill="url(#ilHousing)" />

      {/* Housing left/right ridges */}
      <rect x="140" y="130" width="12" height="84" rx="4" fill="#1A3550" />
      <rect x="368" y="130" width="12" height="84" rx="4" fill="#1A3550" />

      {/* Front glass panel */}
      <rect x="155" y="130" width="210" height="82" rx="6" fill="url(#ilGlass)" />

      {/* LED array — bright central zone */}
      <rect x="168" y="142" width="184" height="58" rx="4" fill="#071018" opacity="0.7" />
      {/* LED glow center */}
      <ellipse cx="260" cy="171" rx="70" ry="24" fill={accent} opacity="0.18" />
      <ellipse cx="260" cy="171" rx="40" ry="14" fill="#FFF8D0" opacity="0.22" />
      {/* LED dot grid */}
      {[-3, -2, -1, 0, 1, 2, 3].map(col =>
        [-1, 0, 1].map(row => (
          <circle
            key={`led-${col}-${row}`}
            cx={260 + col * 22}
            cy={171 + row * 16}
            r={3}
            fill="#FFF8E0"
            opacity={0.75 - Math.abs(col) * 0.06 - Math.abs(row) * 0.05}
          />
        ))
      )}

      {/* Corner screws */}
      {[[163, 137], [349, 137], [163, 203], [349, 203]].map(([cx, cy], i) => (
        <circle key={`screw-${i}`} cx={cx} cy={cy} r={5} fill="#0E2234" stroke="#2A4558" strokeWidth="1" />
      ))}

      {/* Ex certification plate */}
      <rect x="214" y="128" width="92" height="14" rx="3" fill="#0B1D2E" stroke="#1E3A52" strokeWidth="0.5" />
      <text x="260" y="138.5" textAnchor="middle" fill={accent} fontSize="7.5" fontWeight="700" fontFamily="monospace" letterSpacing="0.5">
        ⚡ Ex d IIC T4 Gb
      </text>

      {/* Cable gland entry bottom-left */}
      <rect x="160" y="218" width="28" height="10" rx="5" fill="#14304A" />
      <rect x="166" y="215" width="16" height="16" rx="3" fill="#1A3A54" />

      {/* Lens glow overlay on glass */}
      <ellipse cx="260" cy="171" rx="90" ry="38" fill="url(#ilLens)" opacity="0.18" />

      {/* Hard shadow under housing */}
      <ellipse cx="260" cy="240" rx="100" ry="8" fill="#000" opacity="0.35" filter="url(#ilSoftBlur)" />

      {/* ─── Industrial silhouette ─── */}
      <g opacity="0.88">
        {/* Silhouette ground fill */}
        <rect x="0" y="490" width="520" height="90" fill="#060F18" />

        {/* Tower group 1 — far left */}
        <rect x="0" y="380" width="42" height="200" fill="#060F18" />
        <rect x="14" y="365" width="14" height="20" rx="2" fill="#060F18" />
        {/* Platform rings */}
        <rect x="3" y="420" width="36" height="5" fill="#0A1820" />
        <rect x="3" y="445" width="36" height="4" fill="#0A1820" />

        {/* Pipe rack left */}
        <rect x="42" y="455" width="60" height="4" fill="#060F18" />
        <rect x="52" y="430" width="4" height="29" fill="#060F18" />
        <rect x="72" y="425" width="4" height="34" fill="#060F18" />
        <rect x="92" y="440" width="4" height="19" fill="#060F18" />

        {/* Small tower 2 */}
        <rect x="102" y="400" width="32" height="180" fill="#060F18" />
        <rect x="108" y="385" width="20" height="18" rx="2" fill="#060F18" />
        {/* Flame stack */}
        <rect x="115" y="368" width="6" height="20" fill="#060F18" />
        <ellipse cx="118" cy="365" rx="5" ry="8" fill="#E85A0A" opacity="0.55" />
        <ellipse cx="118" cy="360" rx="3" ry="5" fill="#FFA020" opacity="0.4" />

        {/* Pipe connector */}
        <rect x="134" y="440" width="38" height="5" fill="#060F18" />
        <rect x="134" y="460" width="38" height="4" fill="#060F18" />

        {/* Tower 3 — large center-left */}
        <rect x="172" y="340" width="52" height="240" fill="#060F18" />
        <rect x="174" y="320" width="48" height="24" rx="3" fill="#060F18" />
        <rect x="180" y="310" width="36" height="14" rx="2" fill="#060F18" />
        {/* Rings on tower */}
        <rect x="172" y="380" width="52" height="6" fill="#0A1820" />
        <rect x="172" y="410" width="52" height="5" fill="#0A1820" />
        <rect x="172" y="440" width="52" height="5" fill="#0A1820" />
        {/* Steam puff */}
        <ellipse cx="198" cy="302" rx="14" ry="10" fill="#0D1E2E" opacity="0.6" />
        <ellipse cx="206" cy="288" rx="10" ry="8" fill="#0D1E2E" opacity="0.4" />
        <ellipse cx="192" cy="276" rx="8" ry="7" fill="#0D1E2E" opacity="0.3" />

        {/* Pipe between towers */}
        <rect x="224" y="448" width="36" height="5" fill="#060F18" />
        <rect x="224" y="462" width="36" height="4" fill="#060F18" />

        {/* Tower 4 — center */}
        <rect x="260" y="360" width="44" height="220" fill="#060F18" />
        <rect x="262" y="346" width="40" height="18" rx="2" fill="#060F18" />
        <rect x="265" y="338" width="34" height="12" rx="2" fill="#060F18" />
        <rect x="260" y="400" width="44" height="5" fill="#0A1820" />
        <rect x="260" y="430" width="44" height="4" fill="#0A1820" />
        {/* Flame stack top */}
        <rect x="276" y="326" width="8" height="16" fill="#060F18" />
        <ellipse cx="280" cy="323" rx="6" ry="9" fill="#E86010" opacity="0.6" />
        <ellipse cx="280" cy="316" rx="4" ry="6" fill="#FFB030" opacity="0.45" />

        {/* Pipe rack center */}
        <rect x="304" y="430" width="42" height="5" fill="#060F18" />
        <rect x="308" y="410" width="4" height="25" fill="#060F18" />
        <rect x="326" y="418" width="4" height="17" fill="#060F18" />
        <rect x="338" y="425" width="4" height="10" fill="#060F18" />

        {/* Tower 5 — center-right */}
        <rect x="346" y="375" width="46" height="205" fill="#060F18" />
        <rect x="348" y="358" width="42" height="20" rx="3" fill="#060F18" />
        <rect x="356" y="348" width="28" height="14" rx="2" fill="#060F18" />
        <rect x="346" y="415" width="46" height="5" fill="#0A1820" />
        <rect x="346" y="445" width="46" height="4" fill="#0A1820" />

        {/* Pipe rack right */}
        <rect x="392" y="445" width="52" height="5" fill="#060F18" />
        <rect x="396" y="425" width="4" height="25" fill="#060F18" />
        <rect x="418" y="432" width="4" height="18" fill="#060F18" />
        <rect x="436" y="440" width="4" height="10" fill="#060F18" />

        {/* Tower 6 — right */}
        <rect x="444" y="390" width="40" height="190" fill="#060F18" />
        <rect x="446" y="374" width="36" height="20" rx="2" fill="#060F18" />
        <rect x="452" y="365" width="24" height="12" rx="2" fill="#060F18" />
        <rect x="444" y="425" width="40" height="5" fill="#0A1820" />
        {/* Steam */}
        <ellipse cx="464" cy="356" rx="12" ry="9" fill="#0D1E2E" opacity="0.55" />
        <ellipse cx="470" cy="343" rx="9" ry="7" fill="#0D1E2E" opacity="0.38" />

        {/* Far right tower */}
        <rect x="484" y="410" width="36" height="170" fill="#060F18" />
        <rect x="488" y="395" width="28" height="18" rx="2" fill="#060F18" />
      </g>

      {/* Ground level overlay strip */}
      <rect x="0" y="555" width="520" height="25" fill="#040C14" />

      {/* Foreground pipe rack silhouette */}
      <rect x="0" y="502" width="520" height="6" fill="#040C14" />
      <rect x="0" y="515" width="520" height="5" fill="#040C14" />
      {[30, 90, 155, 220, 285, 350, 420, 480].map(x => (
        <rect key={`vp-${x}`} x={x} y="502" width="5" height="58" fill="#040C14" />
      ))}
    </svg>
  )
}

// ── Hero ──────────────────────────────────────────────────────────────────────

function Hero({ onNavigate }: { onNavigate: (p: Page, slug?: string) => void }) {
  const tk = TK
  return (
    <section
      className="relative overflow-hidden flex items-center"
      style={{ paddingTop: 80, paddingBottom: 72, minHeight: '100vh' }}
    >
      {/* Hero background photo */}
      <div className="absolute inset-0">
        <img
          src={heroBgImg}
          alt=""
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center 40%' }}
        />
        {/* Dark navy gradient overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(105deg, rgba(7,24,41,0.97) 0%, rgba(7,24,41,0.90) 50%, rgba(7,24,41,0.60) 100%)' }}
        />
      </div>

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${tk.border}30 1px, transparent 1px), linear-gradient(90deg, ${tk.border}30 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
          opacity: 0.3,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 w-full">
        <div className="flex flex-col items-start">

          {/* ─ Text content ─ */}
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2.5 mb-5 px-4 py-1.5 rounded-full"
              style={{ background: `${tk.accent}15`, border: `1px solid ${tk.accent}35` }}>
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: tk.accent }} />
              <span className="text-[10.5px] font-bold tracking-[0.2em] uppercase" style={{ color: tk.accent }}>
                EXPLOSION-PROOF · FLAMEPROOF · INDUSTRIAL GRADE
              </span>
            </div>

            {/* Heading */}
            <h1
              className="font-display font-extrabold leading-[1.06] tracking-tight mb-6"
              style={{ fontSize: 'clamp(2rem, 4.8vw, 3.2rem)', color: tk.textPrimary }}
            >
              Explosion-Proof<br />
              Lighting &amp;<br />
              Electrical Equipments for<br />
              <span style={{ color: tk.accent }}>Hazardous Industrial<br />Areas</span>
            </h1>

            <p className="text-base md:text-[1.05rem] leading-relaxed mb-8" style={{ color: tk.textSub }}>
              Explosion-proof lighting and electrical equipment for Oil &amp; Gas, Petrochemical, Chemical, and Power industries. Sourced direct from manufacturer with full technical documentation and engineering support.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-6">
              <button
                onClick={() => onNavigate('quotation')}
                className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-bold tracking-wide text-black hover:opacity-90 transition-opacity duration-150"
                style={{ background: tk.accent }}
              >
                Get a Quote
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => onNavigate('products')}
                className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold transition-all duration-150 hover:bg-white/10"
                style={{ border: `1.5px solid rgba(255,255,255,0.40)`, color: tk.textPrimary }}
              >
                Browse Products
              </button>
            </div>

            {/* Baliga Authorized Dealer – below CTA */}
            <div className="flex items-center gap-4 mb-10 py-4 px-5 rounded-md"
              style={{ background: 'rgba(242,167,27,0.08)', border: `1px solid rgba(242,167,27,0.30)`, display: 'inline-flex', boxShadow: '0 0 16px rgba(242,167,27,0.12)' }}>
              <img
                src={balikaLogoImg}
                alt="Baliga Lighting"
                style={{ height: 38, objectFit: 'contain', width: 96, filter: 'drop-shadow(0 0 6px rgba(242,167,27,0.45))' }}
              />
              <div>
                <div className="text-[9px] font-bold tracking-[0.18em] uppercase" style={{ color: tk.accent }}>Authorized Dealer</div>
                <div className="text-[13px] font-bold leading-tight" style={{ color: tk.textPrimary }}>Baliga Lighting</div>
                <div className="text-[10px]" style={{ color: tk.textSub }}>Official Distributor</div>
              </div>
            </div>

            {/* Feature list */}
            <div className="flex flex-wrap gap-6">
              {[
                { icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Quality Products' },
                { icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z', label: 'Industry Expertise' },
                { icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z', label: 'Reliable Support' },
                { icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', label: 'Long-term Partnership' },
              ].map(f => (
                <div key={f.label} className="flex items-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke={tk.accent} strokeWidth="1.5" className="w-4 h-4 flex-shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                  </svg>
                  <span className="text-xs font-semibold" style={{ color: tk.textSub }}>{f.label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

// ── Stat Bar ──────────────────────────────────────────────────────────────────

function StatBar({ stats }: { stats: { value: string; label: string }[] }) {
  const tk = TK
  return (
    <div style={{ background: tk.bgAlt, borderTop: `2px solid ${tk.accent}`, borderBottom: `1px solid ${tk.border}` }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="flex flex-col items-center justify-center py-8 px-4 text-center"
              style={{
                borderRight: i < 3 ? `1px solid ${tk.border}` : 'none',
              }}
            >
              <span
                className="font-display font-black leading-none mb-1.5"
                style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', color: tk.accent }}
              >
                {s.value}
              </span>
              <span className="text-xs font-semibold tracking-wide uppercase" style={{ color: tk.textSub }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Product Range ─────────────────────────────────────────────────────────────

function ProductRange({ onNavigate }: { onNavigate: (p: Page, slug?: string) => void }) {
  const tk = TK
  return (
    <section id="products" className="py-16" style={{ background: tk.bg }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-[10px] font-bold tracking-[0.28em] uppercase mb-2" style={{ color: tk.accent }}>
              PRODUCT RANGE
            </p>
            <h2 className="font-display font-bold text-white text-2xl md:text-[1.9rem] leading-tight">
              What We Supply
            </h2>
            <p className="mt-2 text-sm max-w-lg" style={{ color: tk.textSub }}>
              Complete range of certified explosion-proof and flameproof equipment for hazardous area installations across global industries.
            </p>
          </div>
          <button
            onClick={() => onNavigate('products')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold flex-shrink-0 hover:opacity-75 transition-opacity"
            style={{ color: tk.accent }}
          >
            Full Product Catalog
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
              <path fillRule="evenodd" d="M8.293 4.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L9.586 9H4a1 1 0 010-2h5.586L8.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Product cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SPEC_PRODUCTS.map(prod => {
            const prodData = prod.group ? firstProductInGroup(prod.group) : null
            const isAll = prod.group === null
            return (
              <button
                key={prod.name}
                onClick={() => onNavigate('products')}
                className="group text-left rounded overflow-hidden hover:ring-2 transition-all duration-200 focus:outline-none"
                style={{
                  background: tk.card,
                  border: `1px solid ${tk.border}`,
                  ['--tw-ring-color' as string]: tk.accent,
                }}
              >
                {/* Image area */}
                <div
                  className="relative overflow-hidden"
                  style={{
                    height: 160,
                    background: isAll ? tk.bgAlt : (prodData?.imgBg || tk.bgAlt),
                  }}
                >
                  {prodData?.img && !isAll ? (
                    <img
                      src={prodData.img}
                      alt={prod.name}
                      className={`w-full h-full group-hover:scale-[1.04] transition-transform duration-300 ${
                        prodData.productShot ? 'object-contain p-6' : 'object-cover'
                      }`}
                      loading="lazy"
                    />
                  ) : isAll ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16 opacity-40">
                        <rect x="4" y="4" width="24" height="24" rx="3" stroke="currentColor" strokeWidth="2" className="text-white" />
                        <rect x="36" y="4" width="24" height="24" rx="3" stroke="currentColor" strokeWidth="2" className="text-white" />
                        <rect x="4" y="36" width="24" height="24" rx="3" stroke="currentColor" strokeWidth="2" className="text-white" />
                        <rect x="36" y="36" width="24" height="24" rx="3" stroke="currentColor" strokeWidth="2" className="text-white" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full opacity-20" style={{ background: tk.border }} />
                    </div>
                  )}

                  {/* Ex badge */}
                  {!isAll && (
                    <span
                      className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[9px] font-black tracking-widest"
                      style={{ background: tk.accent, color: '#000' }}
                    >
                      Ex
                    </span>
                  )}
                </div>

                {/* Text area */}
                <div className="p-5">
                  <h3 className="text-white font-bold text-sm mb-2 leading-snug">{prod.name}</h3>
                  <p className="text-xs leading-relaxed mb-3" style={{ color: tk.textSub }}>
                    {prod.desc}
                  </p>
                  <div className="flex items-center justify-between">
                    {prod.tag ? (
                      <span
                        className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded"
                        style={{ background: `${tk.accent}18`, color: tk.accent, border: `1px solid ${tk.accent}30` }}
                      >
                        {prod.tag}
                      </span>
                    ) : (
                      <span
                        className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded"
                        style={{ background: `${tk.accent}18`, color: tk.accent, border: `1px solid ${tk.accent}30` }}
                      >
                        ALL CATEGORIES
                      </span>
                    )}
                    <span
                      className="text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all duration-150"
                      style={{ color: tk.accent }}
                    >
                      Browse
                      <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                        <path fillRule="evenodd" d="M8.293 4.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L9.586 9H4a1 1 0 010-2h5.586L8.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Browse full catalog CTA */}
        <div className="mt-8 text-center">
          <button
            onClick={() => onNavigate('products')}
            className="inline-flex items-center gap-2 px-8 py-3 text-sm font-bold tracking-wide hover:opacity-90 transition-opacity"
            style={{ background: tk.accent, color: '#000' }}
          >
            Browse Full Catalog
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

// ── Industries We Serve ───────────────────────────────────────────────────────

function IndustriesWeServe({ onNavigate }: { onNavigate: (p: Page, slug?: string) => void }) {
  const tk = TK
  return (
    <section id="industries" className="py-16" style={{ background: tk.bgAlt }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="text-[10px] font-bold tracking-[0.28em] uppercase mb-2" style={{ color: tk.accent }}>
            SECTORS WE SERVE
          </p>
          <h2 className="font-display font-bold text-white text-2xl md:text-[1.9rem] mb-3">
            Industries We Serve
          </h2>
          <p className="text-sm max-w-xl mx-auto" style={{ color: tk.textSub }}>
            Proven in the most demanding hazardous environments across India and internationally.
          </p>
        </div>

        {/* Industry image cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {INDUSTRIES_4.map(ind => (
            <button
              key={ind.name}
              onClick={() => onNavigate('industry', ind.slug)}
              className="group relative overflow-hidden focus:outline-none"
              style={{ height: 280, borderRadius: 4 }}
            >
              <img
                src={ind.img}
                alt={ind.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              {/* Dark overlay */}
              <div
                className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-75"
                style={{ background: 'linear-gradient(to top, rgba(4,12,22,0.92) 0%, rgba(4,12,22,0.45) 50%, rgba(4,12,22,0.1) 100%)' }}
              />
              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
                <p className="text-white font-bold text-base leading-tight">{ind.name}</p>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs font-semibold flex items-center gap-1" style={{ color: tk.accent }}>
                  Explore
                  <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                    <path fillRule="evenodd" d="M8.293 4.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L9.586 9H4a1 1 0 010-2h5.586L8.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => onNavigate('industries')}
            className="inline-flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-75"
            style={{ color: tk.accent }}
          >
            View All Industries
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
              <path fillRule="evenodd" d="M8.293 4.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L9.586 9H4a1 1 0 010-2h5.586L8.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

// ── Why CND Hitech (light background) ────────────────────────────────────────

function WhyCNDHitech({ onNavigate }: { onNavigate: (p: Page, slug?: string) => void }) {
  const cards = [
    {
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      title: 'Tested & Approved Products',
      desc: 'Every product undergoes rigorous testing with full conformity declarations, test certificates, and technical documentation available on request for engineering review.',
      href: 'about',
    },
    {
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      title: 'Direct from Manufacturer',
      desc: 'As an authorized distributor and stockist, we source direct — no middlemen, shorter lead times, competitive pricing, and full manufacturer warranty on every product line.',
      href: 'about',
    },
    {
      icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z',
      title: 'Engineering Support On-Call',
      desc: 'Our technical team assists with zone classification queries, product selection by IP rating and gas group, and installation guidance — from project spec to site commissioning.',
      href: 'contact',
    },
  ]

  return (
    <section className="py-16 bg-[#F4F5F7]">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <p className="text-[10px] font-bold tracking-[0.28em] uppercase mb-2 text-[#B08020]">
            OUR DIFFERENCE
          </p>
          <h2 className="font-display font-bold text-[#0D1F30] text-2xl md:text-[1.9rem]">
            Why CND Hitech
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map(card => (
            <button
              key={card.title}
              onClick={() => onNavigate(card.href === 'about' ? 'about' : 'contact')}
              className="group text-left p-8 bg-white rounded shadow-sm hover:shadow-md transition-all duration-200 border border-[#E5E8EC] hover:border-[#D4A010]/40 focus:outline-none"
            >
              <div className="w-12 h-12 rounded flex items-center justify-center mb-5 bg-[#F2A71B]/12 group-hover:bg-[#F2A71B]/18 transition-colors duration-200">
                <svg viewBox="0 0 24 24" fill="none" stroke="#B08020" strokeWidth="1.5" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d={card.icon} />
                </svg>
              </div>
              <h3 className="text-[#0D1F30] font-bold text-base mb-3 leading-snug">{card.title}</h3>
              <p className="text-sm text-[#5A6A78] leading-relaxed">{card.desc}</p>
              <span className="inline-flex items-center gap-1 mt-5 text-xs font-semibold text-[#B08020] group-hover:gap-2 transition-all duration-150">
                Learn more
                <svg viewBox="0 0 12 12" fill="currentColor" className="w-3 h-3">
                  <path fillRule="evenodd" d="M6.293 3.293a1 1 0 011.414 0l2 2a1 1 0 010 1.414l-2 2a1 1 0 01-1.414-1.414L7.086 7H3a1 1 0 110-2h4.086L6.293 4.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Trusted Companies – continuous marquee ────────────────────────────────────

function TrustedCompanies() {
  const doubled = [...TRUSTED_CLIENTS, ...TRUSTED_CLIENTS]
  return (
    <section id="clients" className="py-14 bg-white overflow-hidden">
      <p className="text-center text-[9px] font-bold tracking-[0.32em] uppercase text-[#9AA5B0] mb-10">
        TRUSTED BY INDIA'S LEADING INDUSTRIAL GROUPS
      </p>
      <div
        className="relative w-full"
        onMouseEnter={e => {
          const el = e.currentTarget.querySelector<HTMLDivElement>('.animate-marquee')
          if (el) el.style.animationPlayState = 'paused'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget.querySelector<HTMLDivElement>('.animate-marquee')
          if (el) el.style.animationPlayState = 'running'
        }}
      >
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, white, transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, white, transparent)' }} />

        <div className="flex animate-marquee whitespace-nowrap" style={{ width: 'max-content' }}>
          {doubled.map((name, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-3 mx-8 text-[#B0BAC3] font-bold text-sm tracking-widest uppercase"
            >
              <span className="w-1 h-1 rounded-full bg-[#D0D8E0] flex-shrink-0" />
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── CTA Section (orange background) ──────────────────────────────────────────

function CTASection({ onNavigate }: { onNavigate: (p: Page, slug?: string) => void }) {
  return (
    <section className="py-16 relative overflow-hidden" style={{ background: '#F2A71B' }}>
      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)',
          backgroundSize: '10px 10px',
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* Left: content */}
          <div className="flex-1 max-w-xl">
            <p className="text-[9px] font-bold tracking-[0.3em] uppercase text-black/60 mb-3">
              24-HOUR QUOTE TURNAROUND
            </p>
            <h2 className="font-display font-extrabold text-[#0D1F30] text-2xl md:text-3xl lg:text-[2.1rem] leading-tight mb-4">
              Need equipment for a hazardous area project?
            </h2>
            <p className="text-sm text-[#0D1F30]/75 leading-relaxed mb-6 max-w-md">
              Get a detailed quote with full certification documentation and technical specifications — delivered within 24 hours.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('quotation')}
                className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-bold text-white hover:opacity-90 transition-opacity"
                style={{ background: '#0D1F30' }}
              >
                Request a Quote Now
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <a
                href="https://wa.me/919994233119"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-[#0D1F30] hover:bg-black/10 transition-all"
                style={{ border: '1.5px solid rgba(0,0,0,0.35)' }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Right: contact info */}
          <div
            className="flex-shrink-0 rounded-lg p-7 min-w-[240px]"
            style={{ background: 'rgba(0,0,0,0.12)' }}
          >
            <div className="flex items-start gap-3 mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="#0D1F30" strokeWidth="1.5" className="w-5 h-5 flex-shrink-0 mt-0.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <a
                href="https://maps.app.goo.gl/Cy4rwveYGnvVLDxy5?g_st=aw"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#0D1F30]/80 leading-relaxed hover:text-[#0D1F30] transition-colors"
              >
                West C.I.T Nagar, Chennai 600035
              </a>
            </div>
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="#0D1F30" strokeWidth="1.5" className="w-5 h-5 flex-shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a
                href="tel:+919444022338"
                className="text-sm font-bold text-[#0D1F30] hover:opacity-75 transition-opacity"
              >
                +91 94440 22338
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HomePage({ onNavigate }: Props) {
  usePublicData()
  const stats1 = [
    { value: '25+', label: 'Years Experience' },
    { value: '500+', label: 'Products in Catalog' },
    { value: '200+', label: 'Projects Delivered' },
    { value: '24 hr', label: 'Quote Turnaround' },
  ]

  return (
    <main>
      <Hero onNavigate={onNavigate} />
      <StatBar stats={stats1} />
      <ProductRange onNavigate={onNavigate} />
      <IndustriesWeServe onNavigate={onNavigate} />
      <WhyCNDHitech onNavigate={onNavigate} />
      <TrustedCompanies />
      <CTASection onNavigate={onNavigate} />
    </main>
  )
}
