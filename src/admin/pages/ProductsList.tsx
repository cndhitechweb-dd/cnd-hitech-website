import { useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { archiveProduct, categoryName, deleteProductForever, duplicateProduct, hasImage, hasPdf, hasFullDesc, liveProducts, patchProduct, resolveRef, restoreProduct, sortedCategories, toPublicProduct, useStore, type AdminProduct, type Status } from '../../data/store'
import { Button, Card, ConfirmDialog, Empty, IconButton, inputCls, PageHeader, Pagination, ProductThumb, StatusBadge, StatusChip, useToast } from '../ui'
import { fmtDate, stripHtml, uploadProductImage } from '../lib'
import ProductPreview from '../ProductPreview'

const PAGE_SIZE = 10

export function matches(p: AdminProduct, catName: string, q: string) {
  const hay = [p.name, p.code, catName, p.subcategory, p.shortDescription, p.description, p.features.join(' '), p.applications.join(' '), p.certifications,
    p.technicalSpecifications.map(r => `${r.name} ${r.value}`).join(' ')].join(' ').toLowerCase()
  return q.toLowerCase().split(/\s+/).filter(Boolean).every(t => hay.includes(t))
}

export default function ProductsList() {
  const s = useStore()
  const toast = useToast()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const cat = params.get('cat') ?? ''
  const status = params.get('status') ?? ''
  const sort = params.get('sort') ?? 'name'
  const img = params.get('img') ?? ''
  const desc = params.get('desc') ?? ''
  const pdf = params.get('pdf') ?? ''
  const view = params.get('view') ?? 'active'
  const page = Math.max(1, Number(params.get('page') ?? 1))
  const [confirm, setConfirm] = useState<{ p: AdminProduct; forever: boolean } | null>(null)
  const [preview, setPreview] = useState<AdminProduct | null>(null)

  const setParam = (k: string, v: string) => {
    const n = new URLSearchParams(params)
    if (v) n.set(k, v); else n.delete(k)
    if (k !== 'page') n.delete('page')
    setParams(n, { replace: true })
  }

  const rows = useMemo(() => {
    const base = view === 'archived' ? s.products.filter(p => p.archivedAt) : liveProducts(s)
    const list = base.filter(p =>
      (!cat || p.categoryId === cat) && (!status || p.status === status) &&
      (!img || (img === 'with') === hasImage(p)) && (!desc || (desc === 'with') === hasFullDesc(p)) && (!pdf || (pdf === 'with') === hasPdf(p)) &&
      (!q || matches(p, categoryName(s, p.categoryId), q)))
    const by: Record<string, (a: AdminProduct, b: AdminProduct) => number> = {
      name: (a, b) => a.name.localeCompare(b.name),
      'name-desc': (a, b) => b.name.localeCompare(a.name),
      code: (a, b) => a.code.localeCompare(b.code),
      category: (a, b) => categoryName(s, a.categoryId).localeCompare(categoryName(s, b.categoryId)) || a.name.localeCompare(b.name),
      updated: (a, b) => b.updatedAt.localeCompare(a.updatedAt),
      status: (a, b) => a.status.localeCompare(b.status),
    }
    return list.sort(by[sort] ?? by.name)
  }, [s, q, cat, status, sort, view, img, desc, pdf])

  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const cur = Math.min(page, pages)
  const visible = rows.slice((cur - 1) * PAGE_SIZE, cur * PAGE_SIZE)

  const dup = async (p: AdminProduct) => {
    const id = await duplicateProduct(p.id)
    toast('success', 'Product duplicated as a draft')
    navigate(`/admin/products/${id}/edit`)
  }
  const doDelete = async () => {
    if (!confirm) return
    if (confirm.forever) await deleteProductForever(confirm.p.id)
    else await archiveProduct(confirm.p.id)
    toast('success', confirm.forever ? 'Product permanently deleted' : 'Product archived and removed from the public site')
    setConfirm(null)
  }
  const fileInput = useRef<HTMLInputElement>(null)
  const uploadFor = useRef('')
  const askUpload = (id: string) => { uploadFor.current = id; fileInput.current?.click() }
  const onFile = async (f?: File) => {
    const id = uploadFor.current
    if (fileInput.current) fileInput.current.value = ''
    if (!f || !id) return
    try { await uploadProductImage(id, f); toast('success', 'Image uploaded') }
    catch (e) { toast('error', e instanceof Error ? e.message : 'Upload failed') }
  }
  const quickStatus = (p: AdminProduct, st: Status) => patchProduct(p.id, x => ({ ...x, status: st })).then(() => toast('success', `Status set to ${st}`))

  return (
    <>
      <PageHeader title="Products" subtitle={`${rows.length} ${view === 'archived' ? 'archived' : ''} product${rows.length === 1 ? '' : 's'}`}
        actions={<Link to="/admin/products/new"><Button variant="primary" icon="plus">Add Product</Button></Link>} />

      <input ref={fileInput} type="file" hidden accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" onChange={e => onFile(e.target.files?.[0])} />
      <Card className="mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <input className={`${inputCls} lg:col-span-2`} placeholder="Search name, code, category, keywords…" aria-label="Search" value={q} onChange={e => setParam('q', e.target.value)} />
          <select className={inputCls} aria-label="Category filter" value={cat} onChange={e => setParam('cat', e.target.value)}>
            <option value="">All categories</option>
            {sortedCategories(s).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select className={inputCls} aria-label="Status filter" value={status} onChange={e => setParam('status', e.target.value)}>
            <option value="">All statuses</option>
            <option value="published">Published</option><option value="draft">Draft</option><option value="hidden">Hidden</option>
          </select>
          <select className={inputCls} aria-label="Sort" value={sort} onChange={e => setParam('sort', e.target.value)}>
            <option value="name">Name A–Z</option><option value="name-desc">Name Z–A</option><option value="code">Product code</option>
            <option value="category">Category</option><option value="status">Status</option><option value="updated">Recently updated</option>
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
          {([['img', img, 'Image', 'With image', 'Missing image'], ['desc', desc, 'Full description', 'With full description', 'Missing full description'], ['pdf', pdf, 'PDF', 'With PDF', 'Without PDF']] as const).map(([k, v, l, a, b]) => (
            <select key={k} className={inputCls} aria-label={`${l} filter`} value={v} onChange={e => setParam(k, e.target.value)}>
              <option value="">{l}: all</option><option value="with">{a}</option><option value="missing">{b}</option>
            </select>
          ))}
        </div>
        <div className="flex gap-2 mt-3">
          <Button size="sm" variant={view === 'active' ? 'dark' : 'secondary'} onClick={() => setParam('view', '')}>Active</Button>
          <Button size="sm" variant={view === 'archived' ? 'dark' : 'secondary'} onClick={() => setParam('view', 'archived')}>Archived ({s.products.length - liveProducts(s).length})</Button>
        </div>
      </Card>

      <div className="bg-white border border-[#E3E8EF] rounded-xl overflow-hidden">
        {visible.length === 0 ? (
          <Empty title="No products found" text={q || cat || status ? 'Try adjusting your search or filters.' : 'Add your first product.'} />
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#F7F8FA] text-left text-[11px] uppercase tracking-wider text-[#5B6B78]">
                  <tr>{['Product', 'Category', 'Image Status', 'Full Description', 'Catalogue / PDF', 'Status', 'Last Updated', 'Actions'].map(h => <th key={h} className="px-4 py-3 font-semibold whitespace-nowrap">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-[#EEF1F5]">
                  {visible.map(p => (
                    <tr key={p.id} className="hover:bg-[#FAFBFC] align-middle">
                      <td className="px-4 py-3 max-w-[240px]"><Link to={`/admin/products/${p.id}/edit`} className="font-semibold text-[#0E2A47] hover:text-[#B87A00] line-clamp-2">{p.name}</Link><div className="text-[11px] text-[#7B8A99] mt-0.5"><span className="font-mono">{p.code || '—'}</span>{p.subcategory && ` · ${p.subcategory}`}</div></td>
                      <td className="px-4 py-3 text-[#5B6B78] whitespace-nowrap">{categoryName(s, p.categoryId)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <ProductThumb src={resolveRef(p.image)} bg={p.imgBg} />
                          <div className="flex flex-col items-start gap-1">
                            <StatusChip ok={hasImage(p)} okLabel="Image" missingLabel="Image Missing" />
                            {!hasImage(p) && <button type="button" onClick={() => askUpload(p.id)} className="text-[11px] font-semibold text-[#B87A00] hover:underline">Upload Image</button>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3"><StatusChip ok={hasFullDesc(p)} okLabel="Available" missingLabel="Missing" /></td>
                      <td className="px-4 py-3"><StatusChip ok={hasPdf(p)} okLabel="PDF" missingLabel="No PDF" /></td>
                      <td className="px-4 py-3">
                        {p.archivedAt ? <StatusBadge status="archived" /> : (
                          <select aria-label={`Status of ${p.name}`} value={p.status} onChange={e => quickStatus(p, e.target.value as Status)} className="text-xs font-semibold border border-[#D5DCE5] rounded-md px-1.5 py-1 bg-white capitalize">
                            <option value="published">Published</option><option value="draft">Draft</option><option value="hidden">Hidden</option>
                          </select>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-[#7B8A99] whitespace-nowrap">{fmtDate(p.updatedAt)}</td>
                      <td className="px-4 py-3"><RowActions p={p} onView={() => setPreview(p)} onDup={() => dup(p)} onDel={forever => setConfirm({ p, forever })} onRestore={() => restoreProduct(p.id).then(() => toast('success', 'Restored as draft'))} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="md:hidden divide-y divide-[#EEF1F5]">
              {visible.map(p => (
                <li key={p.id} className="p-4">
                  <div className="flex gap-3">
                    <ProductThumb src={resolveRef(p.image)} bg={p.imgBg} size="w-16 h-16" />
                    <div className="min-w-0 flex-1">
                      <Link to={`/admin/products/${p.id}/edit`} className="font-semibold text-sm text-[#0E2A47]">{p.name}</Link>
                      <div className="text-xs text-[#7B8A99] mt-0.5">{categoryName(s, p.categoryId)} · <span className="font-mono">{p.code || '—'}</span></div>
                      <div className="mt-1.5 flex items-center gap-2"><StatusBadge status={p.archivedAt ? 'archived' : p.status} /><span className="text-[11px] text-[#7B8A99]">{fmtDate(p.updatedAt)}</span></div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <StatusChip ok={hasImage(p)} okLabel="Image" missingLabel="Image Missing" />
                        <StatusChip ok={hasFullDesc(p)} okLabel="Description" missingLabel="Description Missing" />
                        <StatusChip ok={hasPdf(p)} okLabel="PDF" missingLabel="No PDF" />
                        {!hasImage(p) && <button type="button" onClick={() => askUpload(p.id)} className="text-[11px] font-semibold text-[#B87A00] underline">Upload Image</button>}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2"><RowActions p={p} onView={() => setPreview(p)} onDup={() => dup(p)} onDel={forever => setConfirm({ p, forever })} onRestore={() => restoreProduct(p.id).then(() => toast('success', 'Restored as draft'))} /></div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      <Pagination page={cur} pages={pages} total={rows.length} onChange={n => setParam('page', String(n))} />

      {confirm && (
        <ConfirmDialog danger title={confirm.forever ? 'Permanently delete product?' : 'Delete product?'}
          confirmLabel={confirm.forever ? 'Delete permanently' : 'Archive product'} onCancel={() => setConfirm(null)} onConfirm={doDelete}
          message={confirm.forever
            ? <><b>{confirm.p.name}</b> will be permanently removed. This cannot be undone.</>
            : <><b>{confirm.p.name}</b> will be archived: removed from the public website but kept here so you can restore it later.</>} />
      )}
      {preview && <ProductPreview product={toPublicProduct(s, preview)} status={preview.status} onClose={() => setPreview(null)} onEdit={() => { const id = preview.id; setPreview(null); navigate(`/admin/products/${id}/edit`) }} />}
    </>
  )
}

function RowActions({ p, onView, onDup, onDel, onRestore }: { p: AdminProduct; onView: () => void; onDup: () => void; onDel: (forever: boolean) => void; onRestore: () => void }) {
  return (
    <div className="flex items-center gap-0.5 -ml-2 md:ml-0">
      <IconButton icon="eye" label="View" onClick={onView} />
      <Link to={`/admin/products/${p.id}/edit`} aria-label="Edit" title="Edit" className="w-9 h-9 inline-flex items-center justify-center rounded-lg text-[#5B6B78] hover:bg-[#EEF1F5] hover:text-[#0E2A47]"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-[18px] h-[18px]"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" /></svg></Link>
      <IconButton icon="copy" label="Duplicate" onClick={onDup} />
      {p.archivedAt && <IconButton icon="restore" label="Restore" onClick={onRestore} />}
      <IconButton icon="trash" label={p.archivedAt ? 'Delete permanently' : 'Delete'} danger onClick={() => onDel(!!p.archivedAt)} />
    </div>
  )
}
