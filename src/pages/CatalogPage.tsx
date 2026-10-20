import { useState, useEffect } from 'react'

// PDF assets — Vite resolves these to their final URLs at build time
import exl100Pdf from '../imports/EXL-100_Series_Rev06.pdf?url'
import fhl1539Pdf from '../imports/FHL_-_1539__FLP__HANDLAMP.pdf?url'
import flpw1590Pdf from '../imports/FLPW_1590__LED.pdf?url'
import flpw2595lPdf from '../imports/FLPW_2595L_FLOODLIGHT_100W.pdf?url'
import flp3114Pdf from '../imports/FLP_3114-LED.pdf?url'
import exflo240Pdf from '../imports/EXFLO-240___220.pdf?url'

type Page = 'home' | 'products' | 'catalog'
interface Props { onNavigate: (page: Page) => void }

// ─── Product Data ─────────────────────────────────────────────────────────────

type CatalogProduct = {
  id: string
  catNo: string
  name: string
  series: string
  description: string
  img: string
  pdf: string
  protectionTypes: string[]
  zones: string[]
  certifications: string[]
  specSummary: string
  specs: Record<string, string>
  highlight: string
}

const CATALOG: CatalogProduct[] = [
  {
    id: 'exl-100',
    catNo: 'EXL-100 Series',
    name: 'Explosionproof LED / Aviation Luminaire',
    series: 'EXL Series',
    description: 'Explosionproof cum weatherproof LED/Aviation luminaire designed for Gas & Dust hazardous atmospheres — oil & gas, refineries, chemical industries. Suitable for Zone 1 & Zone 21, Group IIC & IIIC, IP66. Light metal alloy body with spigot mounting and bolted heat-sink joint.',
    img: 'https://images.unsplash.com/photo-1567005363131-ebfdff6371be?w=900&h=900&fit=crop&auto=format',
    pdf: exl100Pdf,
    protectionTypes: ['Ex db', 'Ex tb'],
    zones: ['Zone 1', 'Zone 21'],
    certifications: ['CMRI', 'PESO'],
    specSummary: 'LED 26–100W · IP66 · Ex db IIC T6–T4 · Zone 1 & 21',
    highlight: '3 variants — LED & Aviation',
    specs: {
      'Cat No': 'EXL-100-1 / EXL-100-2 / EXL-100-3',
      'Type of Protection': 'Ex db IIC T6–T4 Gb / Ex tb IIIC T85°C Db IP66',
      'IP Rating': 'IP66',
      'Gas Group': 'IIC & IIIC',
      'Wattage': '26W / 30W / 36W / 40W / 45W / 50W / 60W / 72W / 90W / 100W',
      'LED Type': 'Max SMD 100W / Max COB 60W (EXL-100-1&2)',
      'Aviation (EXL-100-3)': '8W (Low) / 25W (Medium) — Red SMD LED',
      'Material': 'Light Metal Alloy (AL) — Epoxy Powder Coated',
      'Cable Entry': '2 × M20×1.5P or 2 × 0.5 NPT',
      'Surge Protector': '4KV internal + 10KV SPD',
      'Ambient Temp': '−20°C to +60°C',
      'Weight': 'EXL-100-1: 5.7 kg / EXL-100-2: 6.0 kg / EXL-100-3: 7.5 kg',
      'Conformity': 'IS/IEC 60079-0, IS/IEC 60079-1, IS/IEC 60079-31, IS/IEC 60529',
      'CMRI Certificate': 'CMF 24 INEx 0159',
      'PESO Certificate': 'P602443/1',
    },
  },
  {
    id: 'fhl-1539',
    catNo: 'FHL-1539',
    name: 'Flameproof Hand Lamp Luminaire',
    series: 'FHL Series',
    description: 'Compact explosion proof hand lamp with a toughened well glass sealed into a retaining ring. Fitted with insulators screwed into the main body. LED mounted on a specially designed heat sink for thermal control. Suitable where localised lighting is required.',
    img: 'https://images.unsplash.com/photo-1690637656074-f147df54d1f5?w=900&h=900&fit=crop&auto=format',
    pdf: fhl1539Pdf,
    protectionTypes: ['Ex d'],
    zones: ['Zone 1', 'Zone 2'],
    certifications: ['CIMFR', 'CCE', 'BIS'],
    specSummary: '15W LED · IP66 · Ex d IIC T6 · Zone 1 & 2',
    highlight: 'Portable with leather strap',
    specs: {
      'Cat No': 'FHL-1539',
      'Type of Protection': 'Flameproof — Ex d',
      'IP Rating': 'IP66',
      'Gas Group': 'IIB / IIC',
      'Area Classification': 'Zone 1 & 2',
      'Wattage': '40W–60W GLS / 100W GLS / 15W LED',
      'Lamp Output': '100 Lumen/Watt',
      'Material': 'Aluminium (Light Metal Alloy)',
      'Weight': '2.5 Kg (Approx)',
      'Suspension': 'Leather Strap',
      'Cable Entry': '2 × M20×1.5P / 0.5NPT / 0.75ET',
      'Max Cable Size': '3C × 4 sq.mm',
      'Earthing': 'External: 2 × M6 / Internal: 1 × M5',
      'Test Certificate': 'CIMFR, CCE, BIS',
      'Apparatus Standard': 'IS/IEC 60079-0, IS/IEC 60079-7, IS/IEC 60529',
    },
  },
  {
    id: 'flpw-1590',
    catNo: 'FLPW-1590',
    name: 'FLPW LED Bulk Head Luminaire',
    series: 'FLPW Series',
    description: 'Explosion proof bulk head LED Luminaire with integral terminal chamber. Toughened clear round flat glass cemented into a retaining ring. LEDs mounted on an Aluminium plate connected to the terminal chamber through insulating bushes. Direct mounting onto ceiling.',
    img: 'https://images.unsplash.com/photo-1715498886718-652e4c5c27b3?w=900&h=900&fit=crop&auto=format',
    pdf: flpw1590Pdf,
    protectionTypes: ['Ex d'],
    zones: ['Zone 1', 'Zone 2'],
    certifications: ['CMRI', 'CCE'],
    specSummary: 'LED 24W/36W · IP65 · Exd T6 · Zone 1 & 2',
    highlight: 'Ceiling direct-mount, 90 lm/W',
    specs: {
      'Cat No': 'FLPW-1590',
      'Type of Protection': 'Exd / IP 65 / T6',
      'IP Rating': 'IP65',
      'Gas Group': 'Group I, IIA, IIB, IIC',
      'Wattage': '24W / 36W LED Lamps',
      'Application': 'Flood Lighting — 90 Lumen/Watt',
      'Material': 'Aluminium LM6',
      'Weight': '6.0 Kg',
      'Cable Entry': '2 × (0.75" ET / M20)',
      'Mounting': 'Direct mounting onto ceiling',
      'Glass': 'Toughened flat glass',
      'Gasket': 'Neoprene/Silicone',
      'Hardware': 'Stainless Steel (SS-304)',
      'Certificate No': 'CIMFR/TC/SR/H206',
      'Approvals': 'CCE',
    },
  },
  {
    id: 'flpw-2595l',
    catNo: 'FLPW-2595L',
    name: 'Flame Proof LED Floodlight Luminaire',
    series: 'FLPW Series',
    description: 'Explosion proof LED flat glass luminaire with integral control gear. Toughened borosilicate clear flat glass screwed into a retaining ring bolted to the main body. LED Lamp unit wired through FLP cable glands with Neoprene O-ring seal. Suitable for ceiling light or floodlight application.',
    img: 'https://images.unsplash.com/photo-1672529275896-57e7a9f33616?w=900&h=900&fit=crop&auto=format',
    pdf: flpw2595lPdf,
    protectionTypes: ['Ex d'],
    zones: ['Zone 1', 'Zone 2'],
    certifications: ['CMRI', 'CCE'],
    specSummary: 'LED 72W/100W · IP65 · Exd · Zone 1 & 2',
    highlight: '72W → 7000 lm / 100W → 10,000 lm',
    specs: {
      'Cat No': 'FLPW-2595L',
      'Type of Protection': 'Flame Proof — Exd',
      'IP Rating': 'IP65',
      'Gas Group': 'IIA, IIB, IIC',
      'Wattage': '72W / 100W',
      'Lumen Output': '72W → 7000 lm / 100W → 10,000 lm',
      'Colour Temperature': '6500K cool white, 90° viewing angle',
      'Material': 'Aluminium LM6',
      'Weight': '6.0 Kg',
      'Cable Entry': '2 × (0.75" ET / 0.5" NPT / BSP / M20)',
      'Glass': 'Toughened Borosilicate',
      'Suspension': "Type 'B' Ceiling bracket",
      'Gasket': 'Neoprene',
      'Hardware': 'Stainless Steel (SS-304)',
      'CMRI Certificate No': 'CIMFR/TC/P/H47',
      'Apparatus Standard': 'IEC 60079-0, IEC 60079-1, IEC 60529',
    },
  },
  {
    id: 'flp-3114',
    catNo: 'FLP-3114',
    name: 'Flameproof LED Based Vat Light',
    series: 'FLP LED Series',
    description: 'Explosion proof Vat light luminaire with a switch and separate terminal chamber. Toughened clear flat glass sealed in a retaining frame secured to the main body. Glass retaining ring designed for mounting directly on vessel flange. Built-in push button timer switch with 3–5 minute auto-off delay.',
    img: 'https://images.unsplash.com/photo-1776279876113-514976038186?w=900&h=900&fit=crop&auto=format',
    pdf: flp3114Pdf,
    protectionTypes: ['Ex d'],
    zones: ['Zone 1', 'Zone 2'],
    certifications: ['CIMFR', 'CCoE', 'BIS'],
    specSummary: 'LED 20W · IP65 · Exd IIA/IIB · Zone 1 & 2',
    highlight: 'Vessel-flange mount, 35,000 hr LED life',
    specs: {
      'Cat No': 'FLP-3114',
      'Type of Protection': 'Explosionproof — Exd',
      'IP Rating': 'IP65 & IS-12063/1987',
      'Gas Group': 'IIA, IIB',
      'Wattage': '20W LED Array',
      'Switch': 'Push Button type ON-OFF',
      'Auto-Off Timer': '3 to 5 minutes time delay',
      'LED Life': 'Up to 35,000 hours',
      'Material': 'Copper free Aluminium LM6',
      'Weight': '4.5 Kg',
      'Cable Entry': '2 × ¾" ET',
      'Finish': 'Epoxy powder coated',
      'Gasket': 'Neoprene',
      'Hardware': 'Stainless Steel (SS-304)',
      'CIMFR Certificate': 'CIMFR/TC/SR/H293',
      'Approvals': 'CCoE, BIS',
      'Apparatus Standard': 'IS-13346/2004 (IEC 60079-0/2000), IS-2148/2004 (IEC 60079-1/2001)',
    },
  },
  {
    id: 'exflo-240',
    catNo: 'EXFLO-240 / EXFLO-220',
    name: 'Flame Proof Tubular Fluorescent / LED Luminaire',
    series: 'EXFLO Series',
    description: 'Explosion proof fluorescent / LED tube light with integral terminal chamber. Tubular type fitting with electronic ballast and tube holding assembly. Borosilicate glass tube cemented to housing with Neoprene gaskets. Hinge arrangement for easy lamp replacement. Suitable for wall or ceiling mounting.',
    img: 'https://images.unsplash.com/photo-1771970472779-6452fbce94d6?w=900&h=900&fit=crop&auto=format',
    pdf: exflo240Pdf,
    protectionTypes: ['Ex d'],
    zones: ['Zone 1', 'Zone 2'],
    certifications: ['CMRI', 'CCE'],
    specSummary: 'LED/FTL · IP66 · Exd IIC · Zone 1 & 2',
    highlight: '2 sizes — 1380mm & 760mm',
    specs: {
      'Cat No': 'EXFLO-240 / EXFLO-220',
      'Type of Protection': 'Flame Proof — Exd',
      'IP Rating': 'IP66',
      'Gas Group': 'IIC',
      'EXFLO-240 Wattage': '2 × 36/40W FTL or 2 × 20W LED',
      'EXFLO-220 Wattage': '2 × 18/20W FTL or 2 × 10W LED',
      'EXFLO-240 Size': '1380 × 165mm (Dia), Fixing centre: 1273mm',
      'EXFLO-220 Size': '760 × 165mm (Dia), Fixing centre: 658mm',
      'Material': 'Cast Aluminium LM6',
      'Weight': '15.0 Kg (EXFLO-240) / 8.0 Kg (EXFLO-220)',
      'Cable Entry': '2 × (0.75" ET / 0.5" NPT / BSP / M20)',
      'Wire Guard': '5mm Welded Steel Construction',
      'Mounting': 'Wall / Ceiling Mounting',
      'LED Life (LED tube)': '40,000 hours burning',
      'CMRI Certificate': 'CIMFR/TC/P/1131',
      'Apparatus Standard': 'IEC 60079-0, IEC 60079-1, IEC 60529',
    },
  },
]

// ─── Product Modal ────────────────────────────────────────────────────────────

function ProductModal({ product, onClose }: { product: CatalogProduct; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const openPdf = () => window.open(product.pdf, '_blank', 'noopener,noreferrer')

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#071829]/85 backdrop-blur-sm" onClick={onClose} />

      {/* Modal container */}
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-xl shadow-[0_32px_80px_rgba(0,0,0,0.45)] overflow-hidden flex flex-col md:flex-row">
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#0E2A47]/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#0E2A47] transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Left: photo + PDF trigger */}
        <div className="relative w-full md:w-[42%] min-h-[240px] md:min-h-0 flex-shrink-0 bg-[#EEF2F6] cursor-pointer group/photo" onClick={openPdf}>
          <img
            src={product.img.replace('w=900&h=900', 'w=1000&h=1200')}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Dark tint always */}
          <div className="absolute inset-0 bg-[#0E2A47]/30" />
          {/* PDF hover overlay */}
          <div className="absolute inset-0 bg-[#0E2A47]/70 opacity-0 group-hover/photo:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-full border-2 border-[#F2A71B] flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="#F2A71B" strokeWidth="1.5" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <span className="text-white text-sm font-bold tracking-wide">Open Datasheet PDF</span>
          </div>
          {/* Badges bottom */}
          <div className="absolute bottom-5 left-5 right-5 z-10">
            <div className="text-[#F2A71B] text-[10px] font-bold tracking-widest uppercase mb-2">{product.series}</div>
            <div className="flex flex-wrap gap-1.5">
              {product.protectionTypes.map(t => (
                <span key={t} className="px-2.5 py-1 bg-[#0E2A47] text-[#F2A71B] text-xs font-bold rounded tracking-wide">{t}</span>
              ))}
              {product.zones.map(z => (
                <span key={z} className="px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded">{z}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: info */}
        <div className="flex flex-col flex-1 min-h-0">
          {/* Header */}
          <div className="px-7 pt-6 pb-5 border-b border-gray-100 flex-shrink-0">
            <div className="text-[#5B6B78] text-[10px] font-bold tracking-[0.2em] uppercase mb-1">{product.catNo}</div>
            <h2 className="font-display font-bold text-[#0E2A47] text-xl leading-snug mb-1">{product.name}</h2>
            <p className="text-[#5B6B78] text-xs leading-relaxed mb-3">{product.description}</p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#5B6B78] bg-[#EEF2F6] px-2 py-1 rounded font-medium">{product.highlight}</span>
            </div>
          </div>

          {/* Specs — scrollable */}
          <div className="px-7 py-5 overflow-y-auto flex-1">
            <h3 className="text-[10px] font-bold tracking-[0.2em] text-[#5B6B78] uppercase mb-3">Technical Specifications</h3>
            <div className="border border-gray-100 rounded-lg overflow-hidden mb-5">
              {Object.entries(product.specs).map(([key, val], i) => (
                <div key={key} className={`grid grid-cols-[40%_60%] text-xs ${i % 2 === 0 ? 'bg-[#F7F8FA]' : 'bg-white'}`}>
                  <div className="px-3 py-2.5 text-[#5B6B78] font-medium border-r border-gray-100">{key}</div>
                  <div className="px-3 py-2.5 text-[#0E2A47] font-semibold font-mono text-[10.5px] leading-relaxed">{val}</div>
                </div>
              ))}
            </div>

            {/* Certifications */}
            <div className="mb-5">
              <h3 className="text-[10px] font-bold tracking-[0.2em] text-[#5B6B78] uppercase mb-2">Certifications</h3>
              <div className="flex flex-wrap gap-2">
                {product.certifications.map(c => (
                  <span key={c} className="px-3 py-1 border border-[#F2A71B]/50 text-[#0E2A47] text-xs font-bold rounded tracking-wide">{c}</span>
                ))}
              </div>
            </div>
          </div>

          {/* CTA footer */}
          <div className="px-7 py-5 border-t border-gray-100 bg-[#F7F8FA] flex-shrink-0 flex flex-col sm:flex-row gap-3">
            <button
              onClick={openPdf}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-[#F2A71B] hover:bg-[#D4920F] text-[#0E2A47] font-bold text-sm rounded transition-colors duration-150"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              Open Full Datasheet (PDF)
            </button>
            <button className="flex-1 px-5 py-3 border-2 border-[#0E2A47] text-[#0E2A47] hover:bg-[#0E2A47] hover:text-white font-bold text-sm rounded transition-all duration-150">
              Request a Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function CatalogCard({ product, onViewDetails }: { product: CatalogProduct; onViewDetails: () => void }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const openPdf = () => window.open(product.pdf, '_blank', 'noopener,noreferrer')

  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-[0_8px_32px_rgba(14,42,71,0.12)] hover:border-[#F2A71B]/40 transition-all duration-200 group overflow-hidden flex flex-col">
      {/* Image — click opens PDF */}
      <div
        className="relative aspect-square bg-[#0E2A47] overflow-hidden cursor-pointer"
        onClick={openPdf}
        title="Click to open datasheet PDF"
      >
        {!imgLoaded && <div className="absolute inset-0 bg-[#163A5F] animate-pulse" />}
        <img
          src={product.img}
          alt={product.name}
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Always-on dark overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#071829]/80 via-transparent to-[#0E2A47]/20" />

        {/* PDF badge — top left */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#F2A71B] text-[#0E2A47] text-[9.5px] font-bold tracking-wide rounded">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
              <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M4.5 9a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1zM4 10.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 1 0-1h4a.5.5 0 0 1 0 1z"/>
            </svg>
            Datasheet PDF
          </span>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-[#0E2A47]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-250 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="#F2A71B" strokeWidth="1.5" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <span className="font-bold text-sm tracking-wide">Open Datasheet</span>
          </div>
        </div>

        {/* Bottom: Cat No */}
        <div className="absolute bottom-3 left-4 right-4 z-10">
          <div className="font-display font-bold text-[#F2A71B] text-xs tracking-widest uppercase">{product.catNo}</div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Zone + cert pills */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {product.protectionTypes.map(t => (
            <span key={t} className="px-2 py-0.5 text-[9.5px] font-bold text-[#F2A71B] border border-[#F2A71B]/40 rounded">{t}</span>
          ))}
          {product.zones.map(z => (
            <span key={z} className="px-2 py-0.5 text-[9.5px] font-semibold text-[#5B6B78] bg-[#EEF2F6] rounded">{z}</span>
          ))}
        </div>

        <h3 className="font-display font-bold text-[#0E2A47] text-[14px] leading-snug mb-1.5 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-[#5B6B78] text-[11px] leading-relaxed mb-1 flex-1">{product.specSummary}</p>
        <p className="text-[#F2A71B] text-[10.5px] font-semibold mb-4">{product.highlight}</p>

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-gray-100">
          <button
            onClick={onViewDetails}
            className="flex-1 py-2 text-xs font-bold text-[#0E2A47] border border-[#0E2A47] rounded hover:bg-[#0E2A47] hover:text-white transition-all duration-150"
          >
            View Details
          </button>
          <button
            onClick={openPdf}
            className="flex-1 py-2 text-xs font-bold text-[#0E2A47] bg-[#F2A71B] hover:bg-[#D4920F] rounded transition-colors duration-150 flex items-center justify-center gap-1"
          >
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
              <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1"/>
            </svg>
            PDF
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CatalogPage({ onNavigate }: Props) {
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null)
  const [activeZone, setActiveZone] = useState<string>('All')
  const [activeProt, setActiveProt] = useState<string>('All')

  const zones = ['All', 'Zone 1', 'Zone 2', 'Zone 21']
  const prots = ['All', 'Ex d', 'Ex db', 'Ex tb']

  const filtered = CATALOG.filter(p => {
    const zoneOk = activeZone === 'All' || p.zones.includes(activeZone)
    const protOk = activeProt === 'All' || p.protectionTypes.includes(activeProt)
    return zoneOk && protOk
  })

  return (
    <>
      <div className="min-h-screen bg-[#F7F8FA]">
        {/* Page header band */}
        <div className="bg-[#0E2A47] pt-16">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-8 pb-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-[#5B6B78] mb-6">
              <button onClick={() => onNavigate('home')} className="hover:text-[#F2A71B] transition-colors font-medium">Home</button>
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-[#1C4570]">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <button onClick={() => onNavigate('products')} className="hover:text-[#F2A71B] transition-colors font-medium">Products</button>
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-[#1C4570]">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-[#AABDD0] font-medium">Luminaires Catalog</span>
            </nav>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F2A71B]/15 rounded-full border border-[#F2A71B]/30 text-[#F2A71B] text-[10px] font-bold tracking-widest uppercase mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F2A71B]" />
                  Baliga — Certified Products
                </div>
                <h1 className="font-display font-bold text-white text-3xl md:text-4xl mb-2">
                  Flameproof Luminaires Catalog
                </h1>
                <p className="text-[#8DA5BE] text-sm max-w-2xl leading-relaxed">
                  CMRI, PESO, CIMFR and CCE certified explosion-proof luminaires for Zone 1, Zone 2 and Zone 21 classified hazardous areas. Click any product image to open the full technical datasheet PDF.
                </p>
              </div>

              {/* Quick filter pills */}
              <div className="flex flex-col gap-3 flex-shrink-0">
                <div className="flex flex-wrap gap-2">
                  <span className="text-[#5B6B78] text-[10px] font-semibold tracking-widest uppercase self-center mr-1">Zone:</span>
                  {zones.map(z => (
                    <button
                      key={z}
                      onClick={() => setActiveZone(z)}
                      className={`px-3 py-1.5 rounded text-[11px] font-bold tracking-wide transition-all duration-150 ${
                        activeZone === z
                          ? 'bg-[#F2A71B] text-[#0E2A47]'
                          : 'border border-[#1C4570] text-[#AABDD0] hover:border-[#F2A71B]/50 hover:text-[#F2A71B]'
                      }`}
                    >
                      {z}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-[#5B6B78] text-[10px] font-semibold tracking-widest uppercase self-center mr-1">Prot:</span>
                  {prots.map(p => (
                    <button
                      key={p}
                      onClick={() => setActiveProt(p)}
                      className={`px-3 py-1.5 rounded text-[11px] font-bold tracking-wide transition-all duration-150 ${
                        activeProt === p
                          ? 'bg-[#F2A71B] text-[#0E2A47]'
                          : 'border border-[#1C4570] text-[#AABDD0] hover:border-[#F2A71B]/50 hover:text-[#F2A71B]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PDF instruction bar */}
        <div className="bg-[#163A5F] border-b border-[#1C4570]">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-3 flex items-center gap-3">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-[#F2A71B] flex-shrink-0">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-[#8DA5BE] text-xs">
              <span className="text-white font-semibold">Click on any product image</span> to open the manufacturer's technical datasheet PDF in a new tab. Use "View Details" to see specifications inline.
            </p>
          </div>
        </div>

        {/* Product grid */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-10">
          {/* Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-[#5B6B78]">
              Showing <span className="font-semibold text-[#0E2A47]">{filtered.length}</span> of{' '}
              <span className="font-semibold text-[#0E2A47]">{CATALOG.length}</span> products
              {(activeZone !== 'All' || activeProt !== 'All') && (
                <button
                  onClick={() => { setActiveZone('All'); setActiveProt('All') }}
                  className="ml-3 text-[#F2A71B] text-xs font-semibold hover:underline"
                >
                  Clear filters
                </button>
              )}
            </p>
            <div className="flex flex-wrap gap-2">
              {activeZone !== 'All' && (
                <span className="px-2 py-0.5 bg-[#F2A71B]/15 text-[#F2A71B] text-[10px] font-bold rounded">{activeZone}</span>
              )}
              {activeProt !== 'All' && (
                <span className="px-2 py-0.5 bg-[#F2A71B]/15 text-[#F2A71B] text-[10px] font-bold rounded">{activeProt}</span>
              )}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-display font-bold text-[#0E2A47] text-lg mb-2">No products match</p>
              <button onClick={() => { setActiveZone('All'); setActiveProt('All') }} className="text-[#F2A71B] text-sm font-semibold hover:underline">Clear all filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(product => (
                <CatalogCard
                  key={product.id}
                  product={product}
                  onViewDetails={() => setSelectedProduct(product)}
                />
              ))}
            </div>
          )}

          {/* Download all CTA */}
          <div className="mt-16 bg-[#0E2A47] rounded-xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="font-display font-bold text-white text-lg mb-1">Looking for a specific model or custom specification?</h3>
              <p className="text-[#8DA5BE] text-sm">Our technical team will match the right certified luminaire to your zone classification, gas group, and wattage requirement.</p>
            </div>
            <div className="flex flex-wrap gap-3 flex-shrink-0">
              <button className="px-5 py-2.5 bg-[#F2A71B] hover:bg-[#D4920F] text-[#0E2A47] font-bold text-sm rounded whitespace-nowrap transition-colors">
                Talk to an Engineer
              </button>
              <a href="https://wa.me/914412345678" className="px-5 py-2.5 border border-[#F2A71B]/40 text-[#F2A71B] hover:border-[#F2A71B] font-semibold text-sm rounded whitespace-nowrap transition-colors">
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Detail modal */}
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </>
  )
}
