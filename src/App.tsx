import { lazy, Suspense, useState, useMemo, useCallback } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useLocation, useParams } from 'react-router'
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
import { getPublicData, slugify } from './data/store'

export type Page =
  | 'home' | 'products' | 'about' | 'contact'
  | 'enquiry' | 'industries' | 'industry' | 'quotation'

/** @deprecated - navigate to product URLs directly via navigateToProduct() */
export interface ProductDeepLink {
  productId: string
  categoryLabel: string
  subcategory: string
}

const LOGO_FILTER = 'classic-red-white'
const AdminApp = lazy(() => import('./admin/AdminApp'))

/** Reads :slug URL param and passes it to IndustryDetailPage */
function IndustryDetailRoute({ onNavigate }: { onNavigate: (p: Page, slug?: string) => void }) {
  const { slug = 'oil-gas' } = useParams<{ slug: string }>()
  return <IndustryDetailPage onNavigate={onNavigate} industrySlug={slug} />
}

function PublicSite() {
  const navigate = useNavigate()
  const location = useLocation()
  const [enquiryList, setEnquiryList] = useState<string[]>([])

  /** Map current URL path → Page (for Header active-link highlighting) */
  const page: Page = useMemo(() => {
    const p = location.pathname
    if (p.startsWith('/products')) return 'products'
    if (p.startsWith('/industries/')) return 'industry'
    if (p === '/industries') return 'industries'
    if (p === '/about') return 'about'
    if (p === '/contact') return 'contact'
    if (p === '/enquiry') return 'enquiry'
    if (p === '/quotation') return 'quotation'
    return 'home'
  }, [location.pathname])

  /** Navigate to a top-level page by name (used by Header, Footer, page components) */
  const navTo = useCallback((target: Page, industrySlug?: string): void => {
    const urlMap: Record<Page, string> = {
      home: '/',
      products: '/products',
      about: '/about',
      contact: '/contact',
      enquiry: '/enquiry',
      industries: '/industries',
      industry: `/industries/${industrySlug ?? 'oil-gas'}`,
      quotation: '/quotation',
    }
    navigate(urlMap[target] ?? '/')
    window.scrollTo(0, 0)
  }, [navigate])

  /** Navigate directly to a product detail page (e.g. from search) */
  const navigateToProduct = useCallback((productId: string): void => {
    const data = getPublicData()
    const product = data.products.find(p => p.id === productId)
    if (!product) { navigate('/products'); return }
    navigate(`/products/${slugify(product.groupLabel)}/${product.slug}`)
    window.scrollTo(0, 0)
  }, [navigate])

  const toggleEnquiry = (id: string) =>
    setEnquiryList(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  const clearEnquiry = () => setEnquiryList([])

  const sharedProducts = {
    onNavigate: navTo,
    enquiryList,
    onToggleEnquiry: toggleEnquiry,
    onClearEnquiry: clearEnquiry,
    onViewEnquiry: () => navTo('enquiry'),
  }

  return (
    <div className="font-body">
      <Header
        currentPage={page}
        onNavigate={navTo}
        onNavigateToProduct={navigateToProduct}
        enquiryCount={enquiryList.length}
        logoColorFilter={LOGO_FILTER}
      />
      <Routes>
        <Route path="/" element={<HomePage onNavigate={navTo} />} />

        {/* Products — 3 URL levels: /products, /products/:cat, /products/:cat/:product */}
        <Route path="/products" element={<ProductsPage {...sharedProducts} />} />
        <Route path="/products/:categorySlug" element={<ProductsPage {...sharedProducts} />} />
        <Route path="/products/:categorySlug/:productSlug" element={<ProductsPage {...sharedProducts} />} />

        <Route path="/about" element={<AboutPage onNavigate={navTo} />} />
        <Route path="/contact" element={<ContactPage onNavigate={navTo} />} />
        <Route path="/enquiry" element={
          <EnquiryCartPage
            onNavigate={navTo}
            enquiryList={enquiryList}
            onToggleEnquiry={toggleEnquiry}
            onClearEnquiry={clearEnquiry}
          />
        } />
        <Route path="/industries" element={<IndustriesPage onNavigate={navTo} />} />
        <Route path="/industries/:slug" element={<IndustryDetailRoute onNavigate={navTo} />} />
        <Route path="/quotation" element={<QuotationPage onNavigate={navTo} />} />

        {/* Fallback — show home */}
        <Route path="*" element={<HomePage onNavigate={navTo} />} />
      </Routes>
      <Footer onNavigate={navTo} logoColorFilter={LOGO_FILTER} />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin panel — lazy loaded, isolated from public routing */}
        <Route path="/admin/*" element={
          <Suspense fallback={<div className="min-h-screen bg-[#071829]" />}>
            <AdminApp />
          </Suspense>
        } />
        {/* Public site */}
        <Route path="/*" element={<PublicSite />} />
      </Routes>
    </BrowserRouter>
  )
}
