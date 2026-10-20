import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { INDUSTRIES } from '../../data/industries'
import {
  archiveProduct, blankProduct, resolveImage, resolveRef, saveProduct, sortedCategories, storeFile, toPublicProduct, uid,
  useStore, type AdminProduct, type PdfDoc, type PdfType, type SpecRow, type TechAttributes,
} from '../../data/store'
import ProductPreview from '../ProductPreview'
import { fmtDate, optimizeImage, validatePdf } from '../lib'
import { Button, Card, ConfirmDialog, Empty, Field, Icon, IconButton, inputCls, ListEditor, PageHeader, useToast } from '../ui'

function SpecEditor({ rows, onChange, nameLabel = 'Specification', valueLabel = 'Value', addLabel }: { rows: SpecRow[]; onChange: (r: SpecRow[]) => void; nameLabel?: string; valueLabel?: string; addLabel: string }) {
  const upd = (id: string, k: 'name' | 'value', v: string) => onChange(rows.map(r => (r.id === id ? { ...r, [k]: v } : r)))
  return (
    <div className="space-y-2">
      {rows.length > 0 && (
        <div className="hidden sm:grid grid-cols-[1fr_1.4fr_auto] gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#7B8A99] px-0.5"><span>{nameLabel}</span><span>{valueLabel}</span><span className="w-9" /></div>
      )}
      {rows.map(r => (
        <div key={r.id} className="grid grid-cols-1 sm:grid-cols-[1fr_1.4fr_auto] gap-2 items-start p-3 sm:p-0 bg-[#F7F8FA] sm:bg-transparent rounded-lg">
          <input className={inputCls} aria-label={nameLabel} placeholder={nameLabel} value={r.name} onChange={e => upd(r.id, 'name', e.target.value)} />
          <input className={inputCls} aria-label={valueLabel} placeholder={valueLabel} value={r.value} onChange={e => upd(r.id, 'value', e.target.value)} />
          <IconButton icon="trash" label="Remove row" danger onClick={() => onChange(rows.filter(x => x.id !== r.id))} />
        </div>
      ))}
      <Button size="sm" icon="plus" onClick={() => onChange([...rows, { id: uid('s'), name: '', value: '' }])}>{addLabel}</Button>
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return <Card title={title}><div className="space-y-4">{children}</div></Card>
}

const ATTRS: { key: keyof TechAttributes; label: string; ph: string }[] = [
  { key: 'material', label: 'Material', ph: 'e.g. SS 316' },
  { key: 'threadType', label: 'Thread Type', ph: 'e.g. Metric / NPT' },
  { key: 'ipRating', label: 'IP Rating', ph: 'e.g. IP66' },
  { key: 'exClassification', label: 'Ex Classification', ph: 'e.g. Ex d IIC T6' },
  { key: 'dimensions', label: 'Dimensions', ph: 'e.g. 250 × 180 × 120 mm' },
]

export default function ProductForm() {
  const { id } = useParams()
  const s = useStore()
  const navigate = useNavigate()
  const toast = useToast()
  const cats = sortedCategories(s)
  const existing = id ? s.products.find(p => p.id === id) : undefined
  const [p, setP] = useState<AdminProduct | null>(null)
  const [errors, setErrors] = useState<{ name?: string; categoryId?: string }>({})
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [preview, setPreview] = useState(false)
  const [confirmDel, setConfirmDel] = useState(false)
  const imgInput = useRef<HTMLInputElement>(null)
  const pdfInput = useRef<HTMLInputElement>(null)
  const [pdfType, setPdfType] = useState<PdfType>('Product Datasheet')
  const [busyFile, setBusyFile] = useState(false)

  useEffect(() => {
    if (p) return
    if (id && existing) setP(structuredClone(existing))
    else if (!id) setP(blankProduct(cats[0]?.id ?? ''))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, existing])
  useEffect(() => {
    if (!dirty) return
    const h = (e: BeforeUnloadEvent) => { e.preventDefault() }
    window.addEventListener('beforeunload', h)
    return () => window.removeEventListener('beforeunload', h)
  }, [dirty])

  if (id && !existing && !p) {
    return <Empty title="Product not found" action={<Link to="/admin/products"><Button>Back to products</Button></Link>} />
  }
  if (!p) return null

  const set = <K extends keyof AdminProduct>(k: K, v: AdminProduct[K]) => { setP(prev => (prev ? { ...prev, [k]: v } : prev)); setDirty(true) }
  const category = cats.find(c => c.id === p.categoryId)

  const save = async () => {
    const errs: typeof errors = {}
    if (!p.name.trim()) errs.name = 'Product name is required'
    if (!p.categoryId) errs.categoryId = 'Select a category'
    setErrors(errs)
    if (Object.keys(errs).length) { toast('error', 'Please fix the highlighted fields'); return }
    setSaving(true)
    try {
      const clean: AdminProduct = {
        ...p,
        name: p.name.trim(),
        features: p.features.map(f => f.trim()).filter(Boolean),
        applications: p.applications.map(f => f.trim()).filter(Boolean),
        technicalSpecifications: p.technicalSpecifications.filter(r => r.name.trim() || r.value.trim()),
        customFields: p.customFields.filter(r => r.name.trim() || r.value.trim()),
      }
      await saveProduct(clean)
      setDirty(false)
      toast('success', existing ? 'Changes saved — the public page is updated' : 'Product created')
      if (!existing) navigate(`/admin/products/${clean.id}/edit`, { replace: true })
      else setP(clean)
    } catch {
      toast('error', 'Could not save. Browser storage may be full or unavailable.')
    } finally {
      setSaving(false)
    }
  }

  const onImage = async (file?: File) => {
    if (!file) return
    setBusyFile(true)
    try {
      const ref = await storeFile(await optimizeImage(file))
      set('image', ref)
      toast('success', 'Image ready — remember to save')
    } catch (e) { toast('error', e instanceof Error ? e.message : 'Upload failed') }
    finally { setBusyFile(false); if (imgInput.current) imgInput.current.value = '' }
  }
  const onPdf = async (file?: File) => {
    if (!file) return
    setBusyFile(true)
    try {
      validatePdf(file)
      const ref = await storeFile(file)
      const t = new Date().toISOString()
      const doc: PdfDoc = { id: uid('pdf'), name: file.name.replace(/\.pdf$/i, ''), fileRef: ref, size: file.size, type: pdfType, uploadedAt: t, updatedAt: t }
      set('pdfDocuments', [...p.pdfDocuments, doc])
      toast('success', 'PDF attached — remember to save')
    } catch (e) { toast('error', e instanceof Error ? e.message : 'Upload failed') }
    finally { setBusyFile(false); if (pdfInput.current) pdfInput.current.value = '' }
  }

  const imgUrl = resolveRef(p.image)

  return (
    <>
      <PageHeader title={existing ? 'Edit Product' : 'Add Product'} subtitle={existing ? existing.name : 'Create a new product for the catalogue.'}
        actions={<Link to="/admin/products" className="text-sm font-medium text-[#5B6B78] hover:text-[#0E2A47] self-center">← All products</Link>} />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5 items-start pb-24">
        <div className="space-y-5 min-w-0">
          <Section title="Basic Information">
            <Field label="Product Name" required error={errors.name}><input className={inputCls} value={p.name} onChange={e => set('name', e.target.value)} /></Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Product Code / Model Number"><input className={`${inputCls} font-mono`} value={p.code} onChange={e => set('code', e.target.value)} placeholder="e.g. CG101X" /></Field>
              <Field label="Category" required error={errors.categoryId}>
                <select className={inputCls} value={p.categoryId} onChange={e => { set('categoryId', e.target.value); set('subcategory', '') }}>
                  {cats.length === 0 && <option value="">No categories — create one first</option>}
                  {cats.map(c => <option key={c.id} value={c.id}>{c.name}{c.status === 'inactive' ? ' (inactive)' : ''}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Subcategory / Series" hint="Pick an existing series or type a new one.">
              <input className={inputCls} list="subcats" value={p.subcategory} onChange={e => set('subcategory', e.target.value)} />
              <datalist id="subcats">{category?.subcategories.map(sc => <option key={sc} value={sc} />)}</datalist>
            </Field>
            <Field label="Short Description" hint="One line shown in lists and cards."><input className={inputCls} value={p.shortDescription} onChange={e => set('shortDescription', e.target.value)} /></Field>
            <Field label="Full Product Description"><textarea className={inputCls} rows={5} value={p.description} onChange={e => set('description', e.target.value)} /></Field>
          </Section>

          <Section title="Technical Specifications">
            <p className="text-xs text-[#5B6B78] -mt-1">Structured Specification | Value table. Add only what applies to this product.</p>
            <SpecEditor rows={p.technicalSpecifications} onChange={r => set('technicalSpecifications', r)} addLabel="Add specification" />
          </Section>

          <Section title="Technical Information">
            <p className="text-xs text-[#5B6B78] -mt-1">All optional. Filled values are appended to the public specification table.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {ATTRS.map(a => (
                <Field key={a.key} label={a.label}><input className={inputCls} placeholder={a.ph} value={p.attributes[a.key]} onChange={e => set('attributes', { ...p.attributes, [a.key]: e.target.value })} /></Field>
              ))}
            </div>
            <Field label="Certifications" hint="One per line, e.g. ATEX, IECEx, PESO"><textarea className={inputCls} rows={3} value={p.certifications} onChange={e => set('certifications', e.target.value)} /></Field>
            <Field label="Other Technical Details"><textarea className={inputCls} rows={3} value={p.attributes.otherDetails} onChange={e => set('attributes', { ...p.attributes, otherDetails: e.target.value })} /></Field>
          </Section>

          <Section title="Additional Technical Information">
            <p className="text-xs text-[#5B6B78] -mt-1">Custom fields, e.g. Material → SS 316, Thread → Metric, Protection → IP66.</p>
            <SpecEditor rows={p.customFields} onChange={r => set('customFields', r)} nameLabel="Field name" addLabel="Add custom field" />
          </Section>

          <Section title="Features & Applications">
            <Field label="Product Features"><ListEditor values={p.features} onChange={v => set('features', v)} placeholder="e.g. 4 KV internal surge protection" /></Field>
            <Field label="Applications"><ListEditor values={p.applications} onChange={v => set('applications', v)} placeholder="e.g. Refineries, paint booths" /></Field>
          </Section>
        </div>

        <div className="space-y-5 xl:sticky xl:top-24">
          <Card title="Status">
            <select className={inputCls} aria-label="Product status" value={p.status} onChange={e => set('status', e.target.value as AdminProduct['status'])}>
              <option value="published">Published — visible on website</option>
              <option value="draft">Draft — not visible</option>
              <option value="hidden">Hidden — kept in admin only</option>
            </select>
            {existing && <p className="text-[11px] text-[#7B8A99] mt-2">Last updated {fmtDate(existing.updatedAt)}</p>}
          </Card>

          <Card title="Product Image">
            <div className="aspect-[4/3] rounded-lg border border-[#E3E8EF] overflow-hidden flex items-center justify-center" style={{ background: p.imgBg }}>
              <img src={imgUrl || resolveImage('')} alt="Product preview" className="w-full h-full object-contain p-3" />
            </div>
            <input ref={imgInput} type="file" hidden accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" onChange={e => onImage(e.target.files?.[0])} />
            <div className="flex flex-wrap gap-2 mt-3">
              <Button size="sm" icon="upload" disabled={busyFile} onClick={() => imgInput.current?.click()}>{imgUrl ? 'Replace Image' : 'Upload Image'}</Button>
              {imgUrl && <Button size="sm" variant="ghost" icon="trash" onClick={() => set('image', '')}>Remove Image</Button>}
            </div>
            <p className="text-[11px] text-[#7B8A99] mt-2">JPG, PNG or WEBP. Auto-resized to max 1600px; aspect ratio is preserved. Manage more images in Media.</p>
          </Card>

          <Card title="Related Industries">
            <p className="text-xs text-[#5B6B78] mb-3">The product appears under “Suggested Products” on checked industries.</p>
            <div className="space-y-1">
              {INDUSTRIES.map(i => (
                <label key={i.slug} className="flex items-center gap-3 min-h-10 px-2 rounded-lg hover:bg-[#F4F6F9] cursor-pointer text-sm">
                  <input type="checkbox" className="w-4 h-4 accent-[#F2A71B]" checked={p.relatedIndustries.includes(i.slug)}
                    onChange={e => set('relatedIndustries', e.target.checked ? [...p.relatedIndustries, i.slug] : p.relatedIndustries.filter(x => x !== i.slug))} />
                  {i.name}
                </label>
              ))}
            </div>
          </Card>

          <Card title="PDF Catalogue / Datasheets">
            {p.pdfDocuments.length === 0 && <p className="text-xs text-[#5B6B78] mb-3">No PDF attached. The public page shows no download button.</p>}
            <ul className="space-y-2 mb-3">
              {p.pdfDocuments.map(d => (
                <li key={d.id} className="flex items-center gap-2 p-2.5 bg-[#F7F8FA] rounded-lg">
                  <Icon name="doc" className="w-5 h-5 text-[#E53935] shrink-0" />
                  <div className="min-w-0 flex-1">
                    <input className="w-full bg-transparent text-xs font-semibold text-[#0E2A47] focus:outline-none focus:underline" aria-label="PDF name" value={d.name} onChange={e => set('pdfDocuments', p.pdfDocuments.map(x => (x.id === d.id ? { ...x, name: e.target.value } : x)))} />
                    <div className="text-[10px] text-[#7B8A99]">{d.type}</div>
                  </div>
                  <a href={resolveRef(d.fileRef)} target="_blank" rel="noopener noreferrer" aria-label="Open PDF" className="w-8 h-8 flex items-center justify-center rounded-lg text-[#5B6B78] hover:bg-[#E3E8EF]"><Icon name="eye" className="w-4 h-4" /></a>
                  <IconButton icon="trash" label="Remove PDF" danger onClick={() => set('pdfDocuments', p.pdfDocuments.filter(x => x.id !== d.id))} />
                </li>
              ))}
            </ul>
            <input ref={pdfInput} type="file" hidden accept="application/pdf,.pdf" onChange={e => onPdf(e.target.files?.[0])} />
            <div className="flex gap-2">
              <select className={`${inputCls} !py-2 text-xs`} aria-label="PDF type" value={pdfType} onChange={e => setPdfType(e.target.value as PdfType)}>
                <option>Product Datasheet</option><option>Product Catalogue</option>
              </select>
              <Button size="sm" icon="upload" disabled={busyFile} onClick={() => pdfInput.current?.click()}>Upload</Button>
            </div>
          </Card>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 lg:left-64 z-30 bg-white/95 backdrop-blur border-t border-[#E3E8EF] px-4 md:px-8 py-3 flex flex-wrap gap-2 items-center">
        <Button variant="primary" disabled={saving} onClick={save}>{saving ? 'Saving…' : existing ? 'Save Changes' : 'Create Product'}</Button>
        <Button onClick={() => navigate('/admin/products')}>Cancel</Button>
        <Button icon="eye" onClick={() => setPreview(true)}>Preview Product</Button>
        {dirty && <span className="text-xs text-[#9A6700] font-medium">Unsaved changes</span>}
        {existing && <Button variant="ghost" icon="trash" className="ml-auto !text-[#E53935]" onClick={() => setConfirmDel(true)}>Delete Product</Button>}
      </div>

      {preview && <ProductPreview product={toPublicProduct(s, p)} status={p.status} onClose={() => setPreview(false)} />}
      {confirmDel && existing && (
        <ConfirmDialog danger title="Delete product?" confirmLabel="Archive product" onCancel={() => setConfirmDel(false)}
          message={<><b>{existing.name}</b> will be archived and removed from the public website. You can restore it later from Products → Archived.</>}
          onConfirm={async () => { await archiveProduct(existing.id); toast('success', 'Product archived'); setDirty(false); navigate('/admin/products') }} />
      )}
    </>
  )
}
