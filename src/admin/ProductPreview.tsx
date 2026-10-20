import { useEffect } from 'react'
import { ProductDetailPage } from '../pages/ProductsPage'
import type { PublicProduct, Status } from '../data/store'
import { Button } from './ui'

/** Renders the real public product page component for an admin-side preview. */
export default function ProductPreview({ product, status, onClose, onEdit }: { product: PublicProduct; status: Status; onClose: () => void; onEdit?: () => void }) {
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', h) }
  }, [onClose])
  const noop = () => {}
  return (
    <div className="fixed inset-0 z-[95] bg-[#F7F8FA] overflow-y-auto" role="dialog" aria-modal="true" aria-label="Product preview">
      <div className="sticky top-0 z-10 bg-[#071829] text-white px-4 py-2.5 flex flex-wrap items-center gap-3">
        <span className="text-[10px] font-bold tracking-[0.2em] text-[#F2A71B]">PREVIEW</span>
        <span className="text-xs text-[#AABDD0] flex-1 min-w-[200px]">
          This is how the product appears on the public website. {status === 'published' ? 'It is live.' : `Status is “${status}”, so it is NOT visible to visitors yet.`}
        </span>
        {onEdit && <Button size="sm" onClick={onEdit}>Edit</Button>}
        <Button size="sm" variant="primary" onClick={onClose}>Close preview</Button>
      </div>
      <ProductDetailPage preview product={product} categoryLabel={product.groupLabel} subcategory={product.category}
        inEnquiry={false} onToggleEnquiry={noop} onNavigateHome={noop} onNavigateCategories={noop}
        onNavigateSubcategories={noop} onNavigateProducts={noop} onQuote={noop} />
    </div>
  )
}
