import { lazy, Suspense, useState } from 'react'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import EnquiryCartPage from './pages/EnquiryCartPage'
import IndustriesPage from './pages/IndustriesPage'
import IndustryDetailPage from './pages/IndustryDetailPage'
import QuotationPage from './pages/QuotationPage'
import { LOGO_COLORS } from './data/logoColors'

export type Page = 'home' | 'products' | 'about' | 'contact' | 'enquiry' | 'industries' | 'industry' | 'quotation'

const LOGO_FILTER = 'classic-red-white'

const AdminApp = lazy(() => import('./admin/AdminApp'))

function PublicSite() {
  const [page, setPage] = useState<Page>('home')
  const [enquiryList, setEnquiryList] = useState<string[]>([])
  const [activeIndustry, setActiveIndustry] = useState<string>('oil-gas')

  const navigate = (target: Page, industrySlug?: string) => {
    if (industrySlug) setActiveIndustry(industrySlug)
    setPage(target)
    window.scrollTo(0, 0)
  }

  const toggleEnquiry = (id: string) => {
    setEnquiryList(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const clearEnquiry = () => setEnquiryList([])

  return (
    <div className="font-body">
      <Header
        currentPage={page}
        onNavigate={navigate}
        enquiryCount={enquiryList.length}
        logoColorFilter={LOGO_FILTER}
      />
      {page === 'home' && <HomePage onNavigate={navigate} />}
      {page === 'products' && (
        <ProductsPage
          onNavigate={navigate}
          enquiryList={enquiryList}
          onToggleEnquiry={toggleEnquiry}
          onClearEnquiry={clearEnquiry}
          onViewEnquiry={() => navigate('enquiry')}
        />
      )}
      {page === 'about' && <AboutPage onNavigate={navigate} />}
      {page === 'contact' && <ContactPage onNavigate={navigate} />}
      {page === 'enquiry' && (
        <EnquiryCartPage
          onNavigate={navigate}
          enquiryList={enquiryList}
          onToggleEnquiry={toggleEnquiry}
          onClearEnquiry={clearEnquiry}
        />
      )}
      {page === 'industries' && <IndustriesPage onNavigate={navigate} />}
      {page === 'industry' && <IndustryDetailPage onNavigate={navigate} industrySlug={activeIndustry} />}
      {page === 'quotation' && <QuotationPage onNavigate={navigate} />}
      <Footer onNavigate={navigate} logoColorFilter={LOGO_FILTER} />
    </div>
  )
}

export default function App() {
  if (window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin/')) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#071829]" />}>
        <AdminApp />
      </Suspense>
    )
  }
  return <PublicSite />
}
