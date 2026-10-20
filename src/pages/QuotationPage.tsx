import { useState } from 'react'
import { takeQuoteContext } from '../data/store'
import { INDUSTRIES } from '../data/industries'
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

type FormState = {
  name: string
  surname: string
  email: string
  phone: string
  department: string
  companyName: string
  companyType: string
  state: string
  city: string
  inquiry: string
}

type Errors = Partial<Record<keyof FormState, string>>

const INPUT_CLS = 'w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#F2A71B] focus:ring-1 focus:ring-[#F2A71B]/30 text-[#0E2A47] placeholder-[#C8D8E8] transition-colors bg-white'
const SELECT_CLS = `${INPUT_CLS} cursor-pointer`
const LABEL_CLS = 'block text-[11px] font-bold text-[#0E2A47] mb-1.5 tracking-wide'

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={LABEL_CLS}>
        {label}{required && <span className="text-[#E53935] ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-[11px] text-[#E53935]">{error}</p>}
    </div>
  )
}

export default function QuotationPage({ onNavigate }: Props) {
  const [ctx] = useState(() => takeQuoteContext())
  const [form, setForm] = useState<FormState>({
    name: '', surname: '', email: '', phone: '',
    department: '', companyName: '', companyType: '',
    state: '', city: '',
    inquiry: ctx.product ? `I would like a quotation for ${ctx.product.name}${ctx.product.code ? ` (${ctx.product.code})` : ''}.\nQuantity: ` : '',
  })
  const [industry, setIndustry] = useState(ctx.industry ?? '')
  const [errors, setErrors] = useState<Errors>({})
  const [submitted, setSubmitted] = useState(false)

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [k]: e.target.value }))
    if (errors[k]) setErrors(prev => ({ ...prev, [k]: undefined }))
  }

  const validate = (): boolean => {
    const errs: Errors = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.surname.trim()) errs.surname = 'Surname is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.phone.trim()) errs.phone = 'Phone is required'
    if (!form.department) errs.department = 'Please select a department'
    if (!form.companyName.trim()) errs.companyName = 'Company name is required'
    if (!form.companyType) errs.companyType = 'Please select company type'
    if (!form.state) errs.state = 'Please select a state'
    if (!form.inquiry.trim()) errs.inquiry = 'Please describe your inquiry'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    const msg = `Hi CND Hi-Tech,%0A%0A*REQUEST FOR QUOTATION*%0A%0AName: ${form.name} ${form.surname}%0AEmail: ${form.email}%0APhone: ${form.phone}%0ADepartment: ${form.department}%0ACompany: ${form.companyName}%0ACompany Type: ${form.companyType}%0AState: ${form.state}%0ACity: ${form.city}%0A%0A${ctx.product ? `Product: ${ctx.product.name}${ctx.product.code ? ` (${ctx.product.code})` : ''}%0A` : ''}${industry ? `Industry: ${industry}%0A` : ''}%0AInquiry:%0A${encodeURIComponent(form.inquiry)}`
    window.open(`https://wa.me/919994233119?text=${msg}`, '_blank')
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <main className="pt-16 bg-[#F7F8FA] min-h-screen flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
            <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#0E2A47] mb-3">Quotation Request Sent!</h2>
          <p className="text-sm text-[#5B6B78] leading-relaxed mb-6">
            Thank you, <strong>{form.name}</strong>. Your request for quotation has been submitted via WhatsApp.
            Our team will get back to you within 24 hours with pricing and technical documentation.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => { setSubmitted(false); setForm({ name: '', surname: '', email: '', phone: '', department: '', companyName: '', companyType: '', state: '', city: '', inquiry: '' }) }}
              className="w-full py-2.5 bg-[#F2A71B] hover:bg-[#D4920F] text-[#0E2A47] font-bold text-sm rounded-lg transition-colors"
            >
              Submit Another Request
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="w-full py-2.5 border border-gray-200 text-[#5B6B78] font-semibold text-sm rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="pt-16 bg-[#F7F8FA] min-h-screen">
      {/* Page hero */}
      <section className="bg-[#0E2A47] py-14 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(#F2A71B 1px, transparent 1px), linear-gradient(90deg, #F2A71B 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#F2A71B]/30 text-[#F2A71B] text-[11px] font-semibold tracking-widest uppercase mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F2A71B] animate-pulse" />
            24-Hour Quote Turnaround
          </div>
          <h1 className="font-display font-extrabold text-white text-3xl md:text-4xl leading-tight mb-3">
            Request for Quotation
          </h1>
          <p className="text-[#8DA5BE] text-base max-w-xl leading-relaxed">
            Complete the form below and our technical team will respond with detailed pricing and
            certification documentation within 24 hours.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit} noValidate>

          {/* ── Section 1: General Information ── */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 md:p-8 mb-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-7 h-7 rounded bg-[#0E2A47] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">1</div>
              <h2 className="text-[10px] font-bold text-[#0E2A47] tracking-[0.2em] uppercase">General Information</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Name" required error={errors.name}>
                <input type="text" value={form.name} onChange={set('name')} placeholder="Your first name" className={INPUT_CLS} />
              </Field>
              <Field label="Surname" required error={errors.surname}>
                <input type="text" value={form.surname} onChange={set('surname')} placeholder="Your last name" className={INPUT_CLS} />
              </Field>

              <Field label="E-Mail" required error={errors.email}>
                <input type="email" value={form.email} onChange={set('email')} placeholder="you@company.com" className={INPUT_CLS} />
              </Field>
              <Field label="Phone" required error={errors.phone}>
                <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+91 00000 00000" className={INPUT_CLS} />
              </Field>

              <Field label="Company Department" required error={errors.department}>
                <select value={form.department} onChange={set('department')} className={SELECT_CLS}>
                  <option value="">— Choose Department —</option>
                  {COMPANY_DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </Field>
              <Field label="Company Name" required error={errors.companyName}>
                <input type="text" value={form.companyName} onChange={set('companyName')} placeholder="Your company name" className={INPUT_CLS} />
              </Field>

              <Field label="Company Type" required error={errors.companyType}>
                <select value={form.companyType} onChange={set('companyType')} className={SELECT_CLS}>
                  <option value="">— Choose Company Type —</option>
                  {COMPANY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
              <div />

              <Field label="State" required error={errors.state}>
                <select value={form.state} onChange={set('state')} className={SELECT_CLS}>
                  <option value="">— Choose State —</option>
                  {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="City" error={errors.city}>
                <input type="text" value={form.city} onChange={set('city')} placeholder="Your city" className={INPUT_CLS} />
              </Field>
            </div>
          </div>

          {/* ── Section 2: Inquiry ── */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 md:p-8 mb-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-7 h-7 rounded bg-[#0E2A47] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">2</div>
              <h2 className="text-[10px] font-bold text-[#0E2A47] tracking-[0.2em] uppercase">Inquiry</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <Field label="Product">
                <input
                  value={ctx.product ? `${ctx.product.name}${ctx.product.code ? ` (${ctx.product.code})` : ''}` : ''}
                  readOnly
                  placeholder="No specific product selected"
                  className={`${INPUT_CLS} bg-[#F7F8FA]`}
                />
              </Field>
              <Field label="Industry">
                <select value={industry} onChange={e => setIndustry(e.target.value)} className={SELECT_CLS}>
                  <option value="">Select industry (optional)</option>
                  {INDUSTRIES.map(i => <option key={i.slug} value={i.name}>{i.name}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Inquiry" required error={errors.inquiry}>
              <textarea
                value={form.inquiry}
                onChange={set('inquiry')}
                rows={6}
                placeholder="Please describe the products or equipment you require, project details, quantity and technical requirements (product names, catalogue numbers, IP rating, Ex certification, hazardous area zone classification, etc.)..."
                className={`${INPUT_CLS} resize-none`}
              />
            </Field>
          </div>

          {/* ── Submission ── */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 md:p-8">
            <p className="text-xs text-[#8A9AA5] mb-5 leading-relaxed">
              By submitting this form you agree to be contacted by CND Hi-Tech Co. regarding your quotation request.
              Your information will not be shared with third parties.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="flex-1 py-3.5 bg-[#F2A71B] hover:bg-[#D4920F] text-[#0E2A47] font-bold text-sm tracking-wide rounded-lg transition-colors duration-150 flex items-center justify-center gap-2"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                REQUEST A QUOTE
              </button>
              <button
                type="button"
                onClick={() => onNavigate('contact')}
                className="px-6 py-3.5 border border-gray-200 text-[#5B6B78] font-semibold text-sm rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Contact
              </button>
            </div>
          </div>

        </form>
      </div>
    </main>
  )
}
