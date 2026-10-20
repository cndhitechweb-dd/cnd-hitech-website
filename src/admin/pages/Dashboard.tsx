import { Link } from 'react-router'
import { categoryName, hasImage, hasPdf, hasFullDesc, liveProducts, resolveRef, useStore } from '../../data/store'
import { Button, Card, Icon, PageHeader, ProductThumb, StatusBadge } from '../ui'
import { fmtDate } from '../lib'

export default function Dashboard() {
  const s = useStore()
  const products = liveProducts(s)
  const week = Date.now() - 7 * 864e5
  const recent = [...products].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  const stats = [
    { label: 'Total Products', value: products.length, icon: 'box', to: '/admin/products' },
    { label: 'Total Categories', value: s.categories.length, icon: 'tag', to: '/admin/categories' },
    { label: 'Products With Images', value: products.filter(hasImage).length, icon: 'image', to: '/admin/media?filter=with' },
    { label: 'Products Missing Images', value: products.filter(p => !hasImage(p)).length, icon: 'alert', to: '/admin/media?filter=missing', warn: true },
    { label: 'Products With Full Description', value: products.filter(hasFullDesc).length, icon: 'table', to: '/admin/products?desc=with' },
    { label: 'Products Missing Full Description', value: products.filter(p => !hasFullDesc(p)).length, icon: 'alert', to: '/admin/products?desc=missing', warn: true },
    { label: 'Products With PDFs', value: products.filter(hasPdf).length, icon: 'doc', to: '/admin/products?pdf=with' },
    { label: 'Products Without PDFs', value: products.filter(p => !hasPdf(p)).length, icon: 'alert', to: '/admin/products?pdf=missing', warn: true },
    { label: 'Updated in last 7 days', value: products.filter(p => Date.parse(p.updatedAt) > week).length, icon: 'edit', to: '/admin/products?sort=updated' },
  ]
  const counts = { published: 0, draft: 0, hidden: 0 }
  products.forEach(p => counts[p.status]++)
  const archived = s.products.length - products.length

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Overview of your product catalogue." actions={<Link to="/admin/products/new"><Button variant="primary" icon="plus">Add Product</Button></Link>} />
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-6">
        {stats.map(c => (
          <Link key={c.label} to={c.to} className="group bg-white border border-[#E3E8EF] rounded-xl p-4 md:p-5 hover:border-[#F2A71B] transition-colors">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${c.warn && c.value > 0 ? 'bg-[#FDECEC] text-[#E53935]' : 'bg-[#FFF3D6] text-[#B87A00]'}`}><Icon name={c.icon} className="w-[18px] h-[18px]" /></div>
            <div className="font-display font-bold text-2xl md:text-3xl text-[#0E2A47] tabular-nums">{c.value}</div>
            <div className="text-xs text-[#5B6B78] mt-1">{c.label}</div>
          </Link>
        ))}
        <div className="bg-[#0E2A47] rounded-xl p-4 md:p-5 text-white">
          <div className="text-[10px] font-bold tracking-[0.2em] text-[#8DA5BE] mb-3">STATUS</div>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between"><span>Published</span><b>{counts.published}</b></div>
            <div className="flex justify-between"><span>Draft</span><b>{counts.draft}</b></div>
            <div className="flex justify-between"><span>Hidden</span><b>{counts.hidden}</b></div>
            <div className="flex justify-between text-[#8DA5BE]"><span>Archived</span><b>{archived}</b></div>
          </div>
        </div>
      </div>
      <Card title="Recently updated products" action={<Link to="/admin/products?sort=updated" className="text-xs font-semibold text-[#B87A00] hover:underline">View all</Link>}>
        <ul className="divide-y divide-[#EEF1F5] -my-2">
          {recent.slice(0, 6).map(p => (
            <li key={p.id} className="flex items-center gap-3 py-3">
              <ProductThumb src={resolveRef(p.image)} bg={p.imgBg} />
              <div className="min-w-0 flex-1">
                <Link to={`/admin/products/${p.id}/edit`} className="block text-sm font-semibold text-[#0E2A47] hover:text-[#B87A00] truncate">{p.name}</Link>
                <div className="text-xs text-[#7B8A99] truncate">{categoryName(s, p.categoryId)} · {p.code}</div>
              </div>
              <div className="hidden sm:block text-xs text-[#7B8A99]">{fmtDate(p.updatedAt)}</div>
              <StatusBadge status={p.status} />
            </li>
          ))}
        </ul>
      </Card>
    </>
  )
}
