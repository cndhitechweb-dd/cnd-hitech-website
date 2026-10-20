import { useState } from 'react'
import type { Page } from '../App'

interface Props {
  onNavigate: (page: Page, industrySlug?: string) => void
}

const COMPANY_DEPARTMENTS = [
  'Procurement', 'Engineering', 'Projects', 'Operations',
  'Maintenance', 'HSE', 'Quality', 'Finance', 'Management', 'Other',
]
const COMPANY_TYPES = [
  'EPC Contractor', 'Oil & Gas Company', 'Petrochemical Company',
  'Pharmaceutical Company', 'Chemical Company', 'Automobile Manufacturer',
  'Power Generation Company', 'Distributor / Trader', 'Engineering Consultancy',
  'Government / PSU', 'Other',
]
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Jammu & Kashmir', 'Karnataka', 'Kerala', 'Ladakh', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha',
  'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Chandigarh',
]

const IC = 'w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#F2A71B] focus:ring-1 focus:ring-[#F2A71B]/30 text-[#0E2A47] placeholder-[#C8D8E8] transition-colors bg-white'

type RFQForm = { name: string; surname: string; email: string; phone: string; department: string; companyName: string; companyType: string; state: string; city: string; inquiry: string }
type RFQErrors = Partial<Record<keyof RFQForm, string>>

const CONTACT_DETAILS = [
  {
    icon: 'M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z',
    label: 'Address',
    lines: [
      'CND HITECH CO.',
      '#1, Shree SivaGuru Illam, New No.16,',
      'West Road, West C.I.T Nagar,',
      'Chennai, Tamil Nadu 600035',
    ],
    action: {
      href: 'https://maps.app.goo.gl/Cy4rwveYGnvVLDxy5?g_st=aw',
      label: 'Open in Google Maps',
    },
  },
  {
    icon: 'M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z',
    label: 'Phone',
    lines: ['+91 94440 22338'],
    action: {
      href: 'tel:+919444022338',
      label: 'Call Now',
    },
  },
  {
    icon: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75',
    label: 'Email',
    lines: ['cndhitech.india@gmail.com'],
    action: {
      href: 'mailto:cndhitech.india@gmail.com',
      label: 'Send Email',
    },
  },
  {
    icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z',
    label: 'Business Hours',
    lines: ['Mon – Sat: 9:30 AM – 6:00 PM', 'Sunday: Closed'],
    action: null,
  },
]

function RFQForm() {
  const [form, setForm] = useState<RFQForm>({ name: '', surname: '', email: '', phone: '', department: '', companyName: '', companyType: '', state: '', city: '', inquiry: '' })
  const [errors, setErrors] = useState<RFQErrors>({})
  const [submitted, setSubmitted] = useState(false)

  const set = (k: keyof RFQForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [k]: e.target.value }))
    if (errors[k]) setErrors(prev => ({ ...prev, [k]: undefined }))
  }

  const validate = () => {
    const errs: RFQErrors = {}
    if (!form.name.trim()) errs.name = 'Required'
    if (!form.surname.trim()) errs.surname = 'Required'
    if (!form.email.trim()) errs.email = 'Required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email'
    if (!form.phone.trim()) errs.phone = 'Required'
    if (!form.department) errs.department = 'Required'
    if (!form.companyName.trim()) errs.companyName = 'Required'
    if (!form.companyType) errs.companyType = 'Required'
    if (!form.state) errs.state = 'Required'
    if (!form.inquiry.trim()) errs.inquiry = 'Required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    const msg = `Hi CND Hi-Tech,%0A%0A*REQUEST FOR QUOTATION*%0A%0AName: ${form.name} ${form.surname}%0AEmail: ${form.email}%0APhone: ${form.phone}%0ADepartment: ${form.department}%0ACompany: ${form.companyName}%0AType: ${form.companyType}%0AState: ${form.state}%0ACity: ${form.city}%0A%0AInquiry: ${form.inquiry}`
    window.open(`https://wa.me/919994233119?text=${msg}`, '_blank')
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" className="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-[#0E2A47] mb-2">Request Submitted!</h3>
        <p className="text-sm text-[#5B6B78] mb-5 leading-relaxed">
          Thank you, <strong>{form.name}</strong>. Your quotation request has been sent via WhatsApp. We will respond within 24 hours.
        </p>
        <button onClick={() => { setSubmitted(false); setForm({ name: '', surname: '', email: '', phone: '', department: '', companyName: '', companyType: '', state: '', city: '', inquiry: '' }) }}
          className="px-6 py-2.5 bg-[#F2A71B] text-[#0E2A47] font-bold text-sm rounded-lg hover:bg-[#D4920F] transition-colors">
          Submit Another Request
        </button>
      </div>
    )
  }

  const F = ({ label, req, err, children }: { label: string; req?: boolean; err?: string; children: React.ReactNode }) => (
    <div>
      <label className="block text-[11px] font-bold text-[#0E2A47] mb-1.5 tracking-wide">
        {label}{req && <span className="text-[#E53935] ml-0.5">*</span>}
      </label>
      {children}
      {err && <p className="mt-1 text-[11px] text-[#E53935]">{err}</p>}
    </div>
  )

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <p className="text-[10px] font-bold text-[#0E2A47] tracking-widest uppercase mb-1">Request for Quotation</p>
      <p className="text-sm text-[#5B6B78] mb-6">Complete the form below — we respond within 24 hours with pricing and technical documentation.</p>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Section 1: General Info */}
        <div className="text-[9px] font-bold text-[#0E2A47] tracking-[0.2em] uppercase pb-2 border-b border-gray-100">General Information</div>
        <div className="grid sm:grid-cols-2 gap-4">
          <F label="Name" req err={errors.name}><input type="text" value={form.name} onChange={set('name')} placeholder="First name" className={IC} /></F>
          <F label="Surname" req err={errors.surname}><input type="text" value={form.surname} onChange={set('surname')} placeholder="Last name" className={IC} /></F>
          <F label="E-Mail" req err={errors.email}><input type="email" value={form.email} onChange={set('email')} placeholder="you@company.com" className={IC} /></F>
          <F label="Phone" req err={errors.phone}><input type="tel" value={form.phone} onChange={set('phone')} placeholder="+91 00000 00000" className={IC} /></F>
          <F label="Company Department" req err={errors.department}>
            <select value={form.department} onChange={set('department')} className={IC + ' cursor-pointer'}>
              <option value="">— Choose Department —</option>
              {COMPANY_DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </F>
          <F label="Company Name" req err={errors.companyName}><input type="text" value={form.companyName} onChange={set('companyName')} placeholder="Your company" className={IC} /></F>
          <F label="Company Type" req err={errors.companyType}>
            <select value={form.companyType} onChange={set('companyType')} className={IC + ' cursor-pointer'}>
              <option value="">— Choose Company Type —</option>
              {COMPANY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </F>
          <div />
          <F label="State" req err={errors.state}>
            <select value={form.state} onChange={set('state')} className={IC + ' cursor-pointer'}>
              <option value="">— Choose State —</option>
              {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </F>
          <F label="City" err={errors.city}><input type="text" value={form.city} onChange={set('city')} placeholder="Your city" className={IC} /></F>
        </div>

        {/* Section 2: Inquiry */}
        <div className="text-[9px] font-bold text-[#0E2A47] tracking-[0.2em] uppercase pb-2 border-b border-gray-100 pt-2">Inquiry</div>
        <F label="Inquiry" req err={errors.inquiry}>
          <textarea value={form.inquiry} onChange={set('inquiry')} rows={5}
            placeholder="Please describe the products or equipment you require, project details, quantity and technical requirements..."
            className={IC + ' resize-none'} />
        </F>

        <button type="submit" className="w-full py-3.5 bg-[#F2A71B] hover:bg-[#D4920F] text-[#0E2A47] font-bold text-sm tracking-wide rounded-lg transition-colors duration-150">
          REQUEST A QUOTE
        </button>
      </form>
    </div>
  )
}

export default function ContactPage({ onNavigate }: Props) {
  return (
    <main className="pt-16 bg-[#F7F8FA] min-h-screen">
      {/* Page hero */}
      <section className="bg-[#0E2A47] py-16 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(#F2A71B 1px, transparent 1px), linear-gradient(90deg, #F2A71B 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#F2A71B]/30 text-[#F2A71B] text-[11px] font-semibold tracking-widest uppercase mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F2A71B] animate-pulse" />
            Get in Touch
          </div>
          <h1 className="font-display font-extrabold text-white text-3xl md:text-4xl leading-tight mb-3">
            Contact CND Hitech
          </h1>
          <p className="text-[#8DA5BE] text-base max-w-xl leading-relaxed">
            Request a quote, get technical support, or find our office. We respond within 24 hours on all enquiries.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-14">
        <div className="grid lg:grid-cols-5 gap-10">

          {/* Left — contact details + CTA */}
          <div className="lg:col-span-2 space-y-6">
            {CONTACT_DETAILS.map(item => (
              <div
                key={item.label}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#0E2A47] flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#F2A71B" strokeWidth="1.5" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-[#0E2A47] tracking-widest uppercase mb-1.5">{item.label}</p>
                    {item.lines.map((line, i) => (
                      item.action && (item.action.href.startsWith('tel:') || item.action.href.startsWith('mailto:')) ? (
                        <a
                          key={i}
                          href={item.action.href}
                          className="block text-sm text-[#0E2A47] font-medium leading-relaxed hover:text-[#F2A71B] transition-colors"
                        >
                          {line}
                        </a>
                      ) : (
                        <p key={i} className="text-sm text-[#5B6B78] leading-relaxed">{line}</p>
                      )
                    ))}
                    {item.action && (
                      <a
                        href={item.action.href}
                        target={item.action.href.startsWith('http') ? '_blank' : undefined}
                        rel={item.action.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="inline-flex items-center gap-1.5 mt-3 text-[#F2A71B] text-xs font-semibold hover:underline"
                      >
                        {item.action.label}
                        <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                          <path fillRule="evenodd" d="M8.293 4.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L9.586 9H4a1 1 0 010-2h5.586L8.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/919994233119"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-3.5 rounded-xl bg-[#25D366] hover:bg-[#1ebe5e] text-white font-bold text-sm tracking-wide transition-colors duration-150"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat on WhatsApp
            </a>

            <button
              onClick={() => onNavigate('products')}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-[#0E2A47] text-[#0E2A47] font-bold text-sm tracking-wide hover:bg-[#0E2A47] hover:text-white transition-all duration-150"
            >
              Browse Products
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                <path fillRule="evenodd" d="M8.293 4.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L9.586 9H4a1 1 0 010-2h5.586L8.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Right — map + quote form */}
          <div className="lg:col-span-3 space-y-6">
            {/* Google Maps embed */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-[#0E2A47] tracking-widest uppercase">Our Location</p>
                  <p className="text-sm text-[#5B6B78] mt-0.5">West C.I.T Nagar, Chennai</p>
                </div>
                <a
                  href="https://maps.app.goo.gl/Cy4rwveYGnvVLDxy5?g_st=aw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0E2A47] text-white text-[11px] font-semibold hover:bg-[#163A5F] transition-colors duration-150"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                  Open in Maps
                </a>
              </div>
              <div className="relative" style={{ height: '320px' }}>
                <iframe
                  title="CND Hitech Location"
                  src="https://maps.google.com/maps?q=West+CIT+Nagar+Chennai+600035+India&output=embed&z=16"
                  width="100%"
                  height="100%"
                  style={{ border: 0, display: 'block' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Request for Quotation form */}
            <RFQForm />
          </div>
        </div>
      </div>
    </main>
  )
}
