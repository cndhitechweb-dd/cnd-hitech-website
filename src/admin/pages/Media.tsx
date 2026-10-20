import { useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import { categoryName, hasImage, liveProducts, resolveRef, patchProduct, resolveImage, storeFile, useStore, type AdminProduct } from '../../data/store'
import { optimizeImage } from '../lib'
import { Button, ConfirmDialog, Empty, Field, inputCls, Modal, PageHeader, ProductThumb, StatusChip, useToast } from '../ui'

type Tile = { p: AdminProduct; ref: string; primary: boolean }

export default function Media() {
  const s = useStore()
  const toast = useToast()
  const products = liveProducts(s)
  const [q, setQ] = useState('')
  const [params, setParams] = useSearchParams()
  const f = params.get('filter')
  const only: 'all' | 'with' | 'missing' = f === 'with' || f === 'missing' ? f : 'all'
  const setOnly = (v: string) => setParams(v === 'all' ? {} : { filter: v }, { replace: true })
  const [prev, setPrev] = useState<Tile | null>(null)
  const [del, setDel] = useState<Tile | null>(null)
  const [target, setTarget] = useState('')
  const input = useRef<HTMLInputElement>(null)
  const action = useRef<{ kind: 'add' | 'replace'; tile?: Tile; productId?: string }>({ kind: 'add' })

  const tiles: Tile[] = useMemo(() => products
    .filter(p => !q || `${p.name} ${p.code}`.toLowerCase().includes(q.toLowerCase()))
    .flatMap(p => [...(hasImage(p) ? [{ p, ref: p.image, primary: true }] : []), ...p.gallery.filter(g => resolveRef(g)).map(ref => ({ p, ref, primary: false }))]), [s, q])
  const missing = products.filter(p => !hasImage(p) && (!q || `${p.name} ${p.code}`.toLowerCase().includes(q.toLowerCase())))
  const withCount = products.filter(hasImage).length
  const missingCount = products.length - withCount

  const pick = (a: typeof action.current) => { action.current = a; input.current?.click() }
  const onFile = async (file?: File) => {
    const a = action.current
    if (input.current) input.current.value = ''
    if (!file) return
    try {
      const ref = await storeFile(await optimizeImage(file))
      if (a.kind === 'replace' && a.tile) {
        const old = a.tile
        await patchProduct(old.p.id, p => old.primary ? { ...p, image: ref } : { ...p, gallery: p.gallery.map(g => (g === old.ref ? ref : g)) })
        toast('success', 'Image replaced')
      } else if (a.productId) {
        await patchProduct(a.productId, p => (hasImage(p) ? { ...p, gallery: [...p.gallery, ref] } : { ...p, image: ref }))
        toast('success', 'Image uploaded')
      }
    } catch (e) { toast('error', e instanceof Error ? e.message : 'Upload failed') }
  }
  const setPrimary = (t: Tile) => patchProduct(t.p.id, p => ({ ...p, image: t.ref, gallery: [...p.gallery.filter(g => g !== t.ref), ...(hasImage(p) ? [p.image] : [])] })).then(() => toast('success', 'Primary image updated'))
  const remove = async (t: Tile) => {
    await patchProduct(t.p.id, p => {
      if (!t.primary) return { ...p, gallery: p.gallery.filter(g => g !== t.ref) }
      const live = p.gallery.filter(g => resolveRef(g))
      const [next, ...rest] = live
      return { ...p, image: next ?? '', gallery: rest }
    })
    toast('success', 'Image deleted')
    setDel(null)
  }

  return (
    <>
      <PageHeader title="Media / Images" subtitle="Manage product images. JPG, PNG and WEBP; auto-optimised with aspect ratio preserved." />
      <input ref={input} type="file" hidden accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" onChange={e => onFile(e.target.files?.[0])} />
      <div className="bg-white border border-[#E3E8EF] rounded-xl p-4 mb-5 grid gap-3 md:grid-cols-[1fr_1fr_auto] items-end">
        <Field label="Upload image for product">
          <select className={inputCls} value={target} onChange={e => setTarget(e.target.value)}>
            <option value="">Select product…</option>
            {[...products].sort((a, b) => a.name.localeCompare(b.name)).map(p => <option key={p.id} value={p.id}>{p.name}{p.code ? ` (${p.code})` : ''}</option>)}
          </select>
        </Field>
        <Field label="Search images"><input className={inputCls} value={q} onChange={e => setQ(e.target.value)} placeholder="Product name or code" /></Field>
        <Button variant="primary" icon="upload" disabled={!target} onClick={() => pick({ kind: 'add', productId: target })}>Upload</Button>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[['Total Products', products.length, ''], ['Images Available', withCount, 'text-[#17803D]'], ['Images Missing', missingCount, missingCount ? 'text-[#9A6700]' : '']].map(([l, v, c]) => (
          <div key={l as string} className="bg-white border border-[#E3E8EF] rounded-xl p-3 md:p-4"><div className={`font-display font-bold text-2xl tabular-nums text-[#0E2A47] ${c}`}>{v}</div><div className="text-xs text-[#5B6B78] mt-0.5">{l}</div></div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="Image filter">
        <Button size="sm" variant={only === 'all' ? 'dark' : 'secondary'} onClick={() => setOnly('all')}>All ({products.length})</Button>
        <Button size="sm" variant={only === 'with' ? 'dark' : 'secondary'} onClick={() => setOnly('with')}>With Image ({withCount})</Button>
        <Button size="sm" variant={only === 'missing' ? 'dark' : 'secondary'} onClick={() => setOnly('missing')}>Missing Image ({missingCount})</Button>
      </div>

      {only === 'missing' ? (
        missing.length === 0 ? <Empty title="Every product has an image" /> : (
          <div className="bg-white border border-[#E3E8EF] rounded-xl overflow-hidden">
            <ul className="divide-y divide-[#EEF1F5]">
              {missing.map(p => (
                <li key={p.id} className="flex flex-wrap items-center gap-3 p-3 md:p-4">
                  <ProductThumb src="" />
                  <div className="min-w-0 flex-1 basis-48"><div className="text-sm font-semibold text-[#0E2A47]">{p.name}</div><div className="text-xs text-[#7B8A99]">{categoryName(s, p.categoryId)}{p.code && ` · ${p.code}`}</div></div>
                  <StatusChip ok={false} okLabel="" missingLabel="Image Status: Missing" />
                  <Button size="sm" variant="primary" icon="upload" onClick={() => pick({ kind: 'add', productId: p.id })}>Upload Image</Button>
                </li>
              ))}
            </ul>
          </div>
        )
      ) : tiles.length === 0 && !(only === 'all' && missing.length) ? <Empty title="No images found" /> : (
        <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
          {tiles.map(t => (
            <li key={`${t.p.id}-${t.ref}`} className="bg-white border border-[#E3E8EF] rounded-xl overflow-hidden flex flex-col">
              <button onClick={() => setPrev(t)} className="aspect-[4/3] w-full relative block" style={{ background: t.p.imgBg }} aria-label={`Preview image of ${t.p.name}`}>
                <img src={resolveImage(t.ref)} alt={t.p.name} loading="lazy" className="absolute inset-0 w-full h-full object-contain p-2" />
                {t.primary && <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#F2A71B] text-[#0E2A47] text-[10px] font-bold">PRIMARY</span>}
              </button>
              <div className="p-3 flex-1 flex flex-col gap-2">
                <div className="text-xs font-semibold text-[#0E2A47] line-clamp-2">{t.p.name}</div>
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {!t.primary && <Button size="sm" onClick={() => setPrimary(t)}>Set primary</Button>}
                  <Button size="sm" onClick={() => pick({ kind: 'replace', tile: t })}>Replace</Button>
                  <Button size="sm" variant="ghost" className="!text-[#E53935]" onClick={() => setDel(t)}>Delete</Button>
                </div>
              </div>
            </li>
          ))}
          {only === 'all' && missing.map(p => (
            <li key={`m-${p.id}`} className="bg-white border border-dashed border-[#E0B04A] rounded-xl overflow-hidden flex flex-col">
              <div className="aspect-[4/3] w-full bg-[#FFF8E6] flex flex-col items-center justify-center text-[#9A6700]"><span className="text-sm font-bold">Image Missing</span></div>
              <div className="p-3 flex-1 flex flex-col gap-2">
                <div className="text-xs font-semibold text-[#0E2A47] line-clamp-2">{p.name}</div>
                <Button size="sm" variant="primary" icon="upload" className="mt-auto" onClick={() => pick({ kind: 'add', productId: p.id })}>Upload Image</Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {prev && (
        <Modal wide title={prev.p.name} onClose={() => setPrev(null)}>
          <div className="rounded-lg overflow-hidden" style={{ background: prev.p.imgBg }}><img src={resolveImage(prev.ref)} alt={prev.p.name} className="w-full max-h-[60vh] object-contain" /></div>
        </Modal>
      )}
      {del && <ConfirmDialog danger title="Delete image?" confirmLabel="Delete image" onCancel={() => setDel(null)} onConfirm={() => remove(del)}
        message={<>Remove this image from <b>{del.p.name}</b>?{del.primary && ' The next gallery image (if any) becomes primary.'}</>} />}
    </>
  )
}
