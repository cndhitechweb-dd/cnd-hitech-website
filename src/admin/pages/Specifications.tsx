import { useState } from 'react'
import { Link } from 'react-router'
import { categoryName, liveProducts, useStore } from '../../data/store'
import { Button, Empty, inputCls, PageHeader, StatusBadge } from '../ui'

export default function Specifications() {
  const s = useStore()
  const [q, setQ] = useState('')
    const rows = liveProducts(s)
    .filter(p => (!q || `${p.name} ${p.code}`.toLowerCase().includes(q.toLowerCase())))
    .sort((a, b) => a.name.localeCompare(b.name))
  return (
    <>
      <PageHeader title="Technical Specifications" subtitle="See how many specification rows each product has, then edit them." />
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input className={`${inputCls} max-w-md`} placeholder="Search products…" aria-label="Search products" value={q} onChange={e => setQ(e.target.value)} />
      </div>
      <div className="bg-white border border-[#E3E8EF] rounded-xl overflow-hidden">
        {rows.length === 0 ? <Empty title="No products match" /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F7F8FA] text-left text-[11px] uppercase tracking-wider text-[#5B6B78]">
                <tr>{['Product', 'Category', 'Spec rows', 'Custom fields', 'Status', ''].map(h => <th key={h} className="px-4 py-3 font-semibold whitespace-nowrap">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-[#EEF1F5]">
                {rows.map(p => (
                  <tr key={p.id}>
                    <td className="px-4 py-3 font-semibold text-[#0E2A47]">{p.name}<div className="font-mono text-[11px] font-normal text-[#7B8A99]">{p.code}</div></td>
                    <td className="px-4 py-3 text-[#5B6B78] whitespace-nowrap">{categoryName(s, p.categoryId)}</td>
                    <td className="px-4 py-3 tabular-nums">{p.technicalSpecifications.length}</td>
                    <td className="px-4 py-3 tabular-nums">{p.customFields.length}</td>
                    <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                    <td className="px-4 py-3 text-right"><Link to={`/admin/products/${p.id}/edit`}><Button size="sm" icon="edit">Edit</Button></Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
