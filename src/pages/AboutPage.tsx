import { useEffect } from 'react'

type Page = 'home' | 'products' | 'about'
interface Props { onNavigate: (page: Page) => void }

const STATS = [
  { n: '25+', label: 'Years in Business' },
  { n: '500+', label: 'SKUs in Catalog' },
  { n: '200+', label: 'Projects Delivered' },
]

const VALUES = [
  {
    title: 'Safety First',
    desc: 'Every product decision is anchored in protecting human life in hazardous environments. No compromise on certification or quality.',
    icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
  },
  {
    title: 'Technical Integrity',
    desc: 'We never substitute a specified product without engineering review. Full datasheet and certification transparency on every line item.',
    icon: 'M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15M14.25 3.104c.251.023.501.05.75.082M19.8 15l-1.575.4A11.965 11.965 0 0112 17h0a11.965 11.965 0 01-6.225-1.6L4.2 15m15.6 0l-1.8 7.2a1.5 1.5 0 01-1.457 1.15H7.457A1.5 1.5 0 016 22.2l-1.8-7.2',
  },
  {
    title: 'Customer Partnership',
    desc: "We work as an extension of your procurement and engineering teams — responding to RFQs within 24 hours, every time.",
    icon: 'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z',
  },
  {
    title: 'Quality Assurance',
    desc: 'ISO-aligned quality management with incoming inspection, in-process checks, and final test records available for every shipment.',
    icon: 'M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75',
  },
]

const LEADERSHIP = [
  { name: 'N. Chandrasekaran', role: 'Managing Director', desc: 'Over 25 years in industrial hazardous area equipment. Pioneered CND Hitech\'s expansion into offshore and marine sectors across India.' },
  { name: 'R. Deepak', role: 'Technical Director', desc: 'Certified Ex Engineer with deep expertise in zone classification, product certification pathways, and engineering consultation for major EPC projects.' },
  { name: 'S. Priya', role: 'Quality Manager', desc: 'Leads the QMS team ensuring every product meets IECEx, PESO, and BIS standards with complete documentation before dispatch.' },
  { name: 'V. Anand', role: 'Sales & Business Development', desc: 'Drives relationships with EPC contractors, OEM integrators, and plant maintenance clients across India and the GCC region.' },
]

const CERTS = [
  { code: 'IECEx', full: 'IEC Scheme for Explosive Atmospheres', body: 'IECEx Secretariat', color: '#1A6B3A', desc: 'International certification confirming conformity with IEC standards for explosive atmospheres. Accepted across 55+ countries worldwide.' },
  { code: 'PESO', full: 'Petroleum & Explosives Safety Organisation', body: 'PESO, India', color: '#8B1A1A', desc: 'Mandatory Indian approval for equipment used in petroleum refineries, pipelines, storage terminals, and LPG installations.' },
  { code: 'CMRI', full: 'Central Mining Research Institute', body: 'CIMFR, India', color: '#6B4A11', desc: 'Testing and certification for mining and hazardous industrial environments under India\'s DGMS regulatory framework.' },
  { code: 'BIS', full: 'Bureau of Indian Standards', body: 'BIS, India', color: '#1A3A6B', desc: 'ISI mark certification ensuring conformance with IS/IEC standards for electrical equipment used in hazardous classified areas.' },
  { code: 'ATEX', full: 'Equipment for Explosive Atmospheres', body: 'EU Notified Bodies', color: '#003399', desc: 'European Union directive 2014/34/EU certification for products marketed in the EEA and recognized globally by industry.' },
  { code: 'CCE', full: 'Chief Controller of Explosives', body: 'CCE, India', color: '#4A1A6B', desc: 'Government of India approval for flameproof equipment in industries that handle explosives and petroleum products.' },
]

// ─── Sections ─────────────────────────────────────────────────────────────────

function Hero({ onNavigate }: Props) {
  return (
    <section className="bg-[#0E2A47] pt-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-10 pb-14">
        <nav className="flex items-center gap-2 text-xs text-[#5B6B78] mb-8">
          <button onClick={() => onNavigate('home')} className="hover:text-[#F2A71B] transition-colors font-medium">Home</button>
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-[#1C4570]">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-[#AABDD0] font-medium">About Us</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 items-end">
          <div>
            <span className="text-[#F2A71B] text-[10px] font-bold tracking-[0.22em] uppercase mb-4 block">About CND Hitech</span>
            <h1 className="font-display font-extrabold text-white text-4xl md:text-[2.8rem] leading-tight mb-5">
              India's Trusted Source for{' '}
              <span className="text-[#F2A71B]">Explosion-Proof Equipment</span>
            </h1>
            <p className="text-[#8DA5BE] text-base leading-relaxed max-w-xl">
              Established in Chennai, CND Hi-Tech Co. has been supplying certified flameproof, explosion-proof, and weatherproof electrical equipment to India's most demanding industries for over 25 years.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {STATS.map(s => (
              <div key={s.label} className="bg-[#163A5F] rounded-lg p-5 border border-[#1C4570]">
                <div className="font-display font-extrabold text-[#F2A71B] text-3xl leading-none mb-1">{s.n}</div>
                <div className="text-[#8DA5BE] text-xs leading-snug">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function OurStory() {
  return (
    <section id="our-story" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <span className="text-[#F2A71B] text-[10px] font-bold tracking-[0.22em] uppercase mb-3 block">Our Story</span>
            <h2 className="font-display font-bold text-[#0E2A47] text-3xl md:text-4xl mb-6">
              Built on a Decade of Hazardous Area Expertise
            </h2>
            <div className="space-y-4 text-[#5B6B78] text-sm leading-relaxed">
              <p>CND Hi-Tech Co. was established at West C.I.T Nagar, Chennai to address the gap between international explosion-proof equipment standards and the availability of certified products in the Indian market.</p>
              <p>From our first shipment of flameproof luminaires to an ONGC refinery installation, we have grown into a full-range supplier covering light fittings, junction boxes, control stations, plugs &amp; sockets, switches, and communication equipment — all certified to Ex d, Ex db, and Ex tb classifications.</p>
              <p>Today, CND Hitech is the preferred technical partner for EPC contractors, instrumentation engineers, and plant maintenance teams across Oil &amp; Gas, Petrochemical, Marine &amp; Offshore, Pharmaceutical, and Mining sectors.</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative pl-8">
            <div className="absolute left-3.5 top-0 bottom-0 w-px bg-gradient-to-b from-[#F2A71B] via-[#1C4570] to-[#1C4570]" />
            {[
              { year: '2009', title: 'Founded in Chennai', desc: 'CND Hi-Tech Co. established in West C.I.T Nagar, Chennai as a specialist supplier of explosion-proof electrical equipment.' },
              { year: '2013', title: 'First ONGC Supply', desc: 'Completed first major supply of flameproof luminaires and junction boxes to an ONGC upstream installation.' },
              { year: '2017', title: 'IECEx Portfolio', desc: 'Expanded catalog to include IECEx-certified control stations, plugs &amp; sockets for offshore and marine applications.' },
              { year: '2021', title: 'Communication Range', desc: 'Launched full Communication category including Ex-proof telephones, hooters, flashers, and acoustic booths.' },
              { year: '2024+', title: 'Expanding Nationally', desc: 'Serving clients across India and the GCC with 500+ certified SKUs and 24-hour quote turnaround.' },
            ].map(item => (
              <div key={item.year} className="relative mb-8 last:mb-0">
                <div className="absolute -left-[26px] w-5 h-5 rounded-full border-2 border-[#F2A71B] bg-[#0E2A47] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#F2A71B]" />
                </div>
                <div className="bg-[#F7F8FA] rounded-lg p-4 border border-gray-100">
                  <div className="text-[#F2A71B] text-[10px] font-bold tracking-widest uppercase mb-1">{item.year}</div>
                  <div className="font-display font-bold text-[#0E2A47] text-sm mb-1">{item.title}</div>
                  <div className="text-[#5B6B78] text-xs leading-relaxed">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function MissionValues() {
  return (
    <section className="py-20 bg-[#0E2A47]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-[#F2A71B] text-[10px] font-bold tracking-[0.22em] uppercase mb-3 block">What Drives Us</span>
          <h2 className="font-display font-bold text-white text-3xl md:text-4xl">Mission, Vision &amp; Values</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#163A5F] rounded-xl p-8 border border-[#1C4570]">
            <div className="w-10 h-10 rounded-lg bg-[#F2A71B]/15 flex items-center justify-center mb-5">
              <svg viewBox="0 0 24 24" fill="none" stroke="#F2A71B" strokeWidth="1.5" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <h3 className="font-display font-bold text-white text-lg mb-3">Our Mission</h3>
            <p className="text-[#8DA5BE] text-sm leading-relaxed">To be the most trusted supplier of certified explosion-proof and flameproof electrical equipment in India — delivering products that protect lives, backed by responsive technical service and complete documentation transparency.</p>
          </div>
          <div className="bg-[#163A5F] rounded-xl p-8 border border-[#1C4570]">
            <div className="w-10 h-10 rounded-lg bg-[#F2A71B]/15 flex items-center justify-center mb-5">
              <svg viewBox="0 0 24 24" fill="none" stroke="#F2A71B" strokeWidth="1.5" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="font-display font-bold text-white text-lg mb-3">Our Vision</h3>
            <p className="text-[#8DA5BE] text-sm leading-relaxed">To expand CND Hitech's reach across South and Southeast Asia as the reference partner for hazardous area electrical equipment — known for product integrity, engineering depth, and zero-compromise quality standards.</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {VALUES.map(v => (
            <div key={v.title} className="bg-[#0B1E35] rounded-lg p-5 border border-[#1C4570] hover:border-[#F2A71B]/40 transition-colors duration-200">
              <div className="w-8 h-8 rounded bg-[#F2A71B]/10 flex items-center justify-center mb-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="#F2A71B" strokeWidth="1.5" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d={v.icon} />
                </svg>
              </div>
              <h4 className="font-display font-bold text-white text-sm mb-2">{v.title}</h4>
              <p className="text-[#5B6B78] text-xs leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Leadership() {
  return (
    <section id="leadership" className="py-20 bg-[#F7F8FA]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-[#F2A71B] text-[10px] font-bold tracking-[0.22em] uppercase mb-3 block">The Team</span>
          <h2 className="font-display font-bold text-[#0E2A47] text-3xl md:text-4xl">Leadership Team</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {LEADERSHIP.map(member => (
            <div key={member.name} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 group">
              <div className="h-40 bg-gradient-to-br from-[#0E2A47] to-[#163A5F] flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-[#F2A71B]/20 border-2 border-[#F2A71B]/40 flex items-center justify-center">
                  <span className="font-display font-bold text-[#F2A71B] text-2xl">
                    {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display font-bold text-[#0E2A47] text-sm mb-0.5">{member.name}</h3>
                <div className="text-[#F2A71B] text-[10px] font-bold tracking-wide uppercase mb-3">{member.role}</div>
                <p className="text-[#5B6B78] text-xs leading-relaxed">{member.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Certifications() {
  return (
    <section id="quality" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-[#F2A71B] text-[10px] font-bold tracking-[0.22em] uppercase mb-3 block">Certifications &amp; Approvals</span>
          <h2 className="font-display font-bold text-[#0E2A47] text-3xl md:text-4xl mb-3">Products You Can Trust</h2>
          <p className="text-[#5B6B78] text-sm max-w-xl mx-auto leading-relaxed">Every product in the CND Hitech catalog carries at least one recognized national or international certification. We maintain original test certificates and conformity declarations for every product line.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {CERTS.map(cert => (
            <div key={cert.code} className="bg-[#F7F8FA] rounded-xl p-6 border border-gray-100 hover:border-gray-200 transition-colors duration-150 group">
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-14 h-14 rounded-full border-2 flex items-center justify-center font-display font-bold text-xs tracking-wider flex-shrink-0 group-hover:scale-105 transition-transform duration-200"
                  style={{ borderColor: cert.color, color: cert.color }}
                >
                  {cert.code}
                </div>
                <div>
                  <h3 className="font-display font-bold text-[#0E2A47] text-sm leading-snug mb-0.5">{cert.full}</h3>
                  <div className="text-[#5B6B78] text-[10px] font-semibold uppercase tracking-wide">{cert.body}</div>
                </div>
              </div>
              <p className="text-[#5B6B78] text-xs leading-relaxed">{cert.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#0E2A47] rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div>
            <h3 className="font-display font-bold text-white text-base mb-3">International Standards We Conform To</h3>
            <div className="flex flex-wrap gap-2">
              {['IS/IEC 60079-0', 'IS/IEC 60079-1', 'IS/IEC 60079-31', 'IS/IEC 60529', 'IS 13346', 'IS 2148'].map(s => (
                <span key={s} className="px-2.5 py-0.5 border border-[#F2A71B]/30 text-[#F2A71B] text-[9px] font-bold rounded tracking-widest">{s}</span>
              ))}
            </div>
          </div>
          <p className="text-[#5B6B78] text-xs max-w-xs leading-relaxed flex-shrink-0">Certificate copies available on request for all products. Contact our technical team for documentation.</p>
        </div>
      </div>
    </section>
  )
}

function QualityHSE() {
  return (
    <section id="hse" className="py-20 bg-[#EEF2F6]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Quality Policy */}
          <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
            <div className="w-12 h-12 rounded-lg bg-[#0E2A47] flex items-center justify-center mb-6">
              <svg viewBox="0 0 24 24" fill="none" stroke="#F2A71B" strokeWidth="1.5" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
            </div>
            <h2 className="font-display font-bold text-[#0E2A47] text-xl mb-4">Quality Policy</h2>
            <p className="text-[#5B6B78] text-sm leading-relaxed mb-6">CND Hitech is committed to supplying only tested, certified products accompanied by full technical documentation. Our quality policy rests on three pillars:</p>
            <div className="space-y-4">
              {[
                { heading: 'Product Integrity', body: 'Every product sourced from certified manufacturers with traceable test certificates and conformity declarations.' },
                { heading: 'Documentation Transparency', body: 'Full datasheet, certificate, and installation guide available for every product in the catalog.' },
                { heading: 'Continuous Improvement', body: 'Regular audit of supplier quality systems and customer feedback integrated into sourcing decisions.' },
              ].map(item => (
                <div key={item.heading} className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#F2A71B]/15 border border-[#F2A71B]/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#F2A71B]" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#0E2A47] text-xs mb-0.5">{item.heading}</div>
                    <div className="text-[#5B6B78] text-xs leading-relaxed">{item.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* HSE Commitment */}
          <div className="bg-[#0E2A47] rounded-xl p-8 border border-[#1C4570]">
            <div className="w-12 h-12 rounded-lg bg-[#F2A71B]/15 flex items-center justify-center mb-6">
              <svg viewBox="0 0 24 24" fill="none" stroke="#F2A71B" strokeWidth="1.5" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h2 className="font-display font-bold text-white text-xl mb-4">HSE Commitment</h2>
            <p className="text-[#8DA5BE] text-sm leading-relaxed mb-6">In hazardous area industries, the wrong product can be catastrophic. We take our HSE responsibility seriously at every level of the supply chain.</p>
            <div className="space-y-4">
              {[
                { heading: 'No Counterfeits', body: 'Strict vendor onboarding — we do not source from unauthorised distributors or unknown-origin stockists.' },
                { heading: 'Zone Classification Support', body: 'Our team assists with zone classification queries and appropriate product selection for your installation.' },
                { heading: 'Installation Guidance', body: 'Technical bulletins and installation notes provided with every shipment for safe field installation.' },
                { heading: 'Incident Reporting', body: 'Any product concern is escalated immediately to the manufacturer. Zero tolerance for known non-conformances.' },
              ].map(item => (
                <div key={item.heading} className="flex gap-3">
                  <div className="w-5 h-5 rounded bg-[#F2A71B]/10 border border-[#F2A71B]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-[#F2A71B]">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-white text-xs mb-0.5">{item.heading}</div>
                    <div className="text-[#5B6B78] text-xs leading-relaxed">{item.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Careers() {
  return (
    <section id="careers" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="text-[#F2A71B] text-[10px] font-bold tracking-[0.22em] uppercase mb-3 block">Join the Team</span>
          <h2 className="font-display font-bold text-[#0E2A47] text-3xl md:text-4xl mb-5">Careers at CND Hitech</h2>
          <p className="text-[#5B6B78] text-sm leading-relaxed mb-8">We are always looking for talented engineers, sales professionals, and technical support specialists who are passionate about industrial safety and explosion-proof technology. Based in Chennai with projects across India.</p>
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              { role: 'Technical Sales Engineer', dept: 'Sales', type: 'Full Time' },
              { role: 'Application Engineer', dept: 'Technical', type: 'Full Time' },
              { role: 'Procurement Specialist', dept: 'Operations', type: 'Full Time' },
            ].map(job => (
              <div key={job.role} className="bg-[#F7F8FA] rounded-lg p-4 border border-gray-100 hover:border-[#F2A71B]/40 transition-colors duration-150 cursor-pointer group">
                <div className="text-[10px] text-[#F2A71B] font-bold tracking-widest uppercase mb-1.5">{job.dept} · {job.type}</div>
                <div className="font-display font-bold text-[#0E2A47] text-sm group-hover:text-[#1C4570] transition-colors">{job.role}</div>
                <div className="text-[#5B6B78] text-[10px] mt-1.5 flex items-center gap-1">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                    <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.757.433 5.726 5.726 0 00.28.14l.019.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
                  </svg>
                  Chennai, Tamil Nadu
                </div>
              </div>
            ))}
          </div>
          <a
            href="mailto:careers@cndhitech.com"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#0E2A47] text-[#0E2A47] hover:bg-[#0E2A47] hover:text-white font-bold text-sm rounded transition-all duration-150"
          >
            Send Your CV
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}

function CTAStrip({ onNavigate }: Props) {
  return (
    <section className="py-20 bg-[#F2A71B] relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'linear-gradient(#0E2A47 1px, transparent 1px), linear-gradient(90deg, #0E2A47 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      <div className="relative max-w-4xl mx-auto px-4 md:px-6 text-center">
        <h2 className="font-display font-extrabold text-[#0E2A47] text-3xl md:text-4xl mb-4">Ready to work together?</h2>
        <p className="text-[#3D2800]/80 text-sm mb-8 max-w-lg mx-auto">Browse our full product catalog or get in touch with our team for a quote, technical consultation, or distributor enquiry.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => onNavigate('products')}
            className="px-8 py-3.5 bg-[#0E2A47] hover:bg-[#071829] text-white font-bold text-sm tracking-wide rounded transition-colors duration-150"
          >
            Browse Products
          </button>
          <a
            href="https://wa.me/919994233119"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-[#0E2A47] text-[#0E2A47] hover:bg-[#0E2A47] hover:text-white font-bold text-sm tracking-wide rounded transition-all duration-150"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Contact on WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}

export default function AboutPage({ onNavigate }: Props) {
  useEffect(() => { window.scrollTo({ top: 0 }) }, [])
  return (
    <main>
      <Hero onNavigate={onNavigate} />
      <OurStory />
      <MissionValues />
      <QualityHSE />
      <Careers />
      <CTAStrip onNavigate={onNavigate} />
    </main>
  )
}
