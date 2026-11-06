import { lazy, Suspense, useState, useRef } from 'react'
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
import { getPublicData } from './data/store'

export type Page = 'home' | 'products' | 'about' | 'contact' | 'enquiry' | 'industries' | 'industry' | 'quotation'

/** Deep-link into a specific product from anywhere (e.g. search). */
export interface ProductDeepLink {
  productId: string
  categoryLabel: string
  subcategory: string
}

const LOGO_FILTER = 'classic-red-white'

const AdminApp = lazy(() => import('./admin/AdminApp'))

function PublicSite() {
  const [page, setPage] = useState<Page>('home')
  const [enquiryList, setEnquiryList] = useState<string[]>([])
  const [activeIndustry, setActiveIndustry] = useState<string>('oil-gas')
  const productDeepLink = useRef<ProductDeepLink | null>(null)

  const navigate = (target: Page, industrySlug?: string) => {
    if (industrySlug) setActiveIndustry(industrySlug)
    if (target !== 'products') productDeepLink.current = null
    setPage(target)
    window.scrollTo(0, 0)
  }

  /** Navigate straight to a product detail page from search. */
  const navigateToProduct = (productId: string) => {
    const product = getPublicData().products.find(p => p.id === productId)
    if (!product) { navigate('products'); return }
    productDeepLink.current = {
      productId,
      categoryLabel: product.groupLabel,
      subcategory: product.category,
    }
    setPage('products')
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
        onNavigateToProduct={navigateToProduct}
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
          initialDeepLink={productDeepLink.current}
          onDeepLinkConsumed={() => { productDeepLink.current = null }}
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
