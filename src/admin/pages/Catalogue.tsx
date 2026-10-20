import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router'
import { categoryName, liveProducts, patchProduct, resolveRef, storeFile, uid, useStore, type PdfDoc, type PdfType } from '../../data/store'
import { fmtDate, fmtSize, validatePdf } from '../lib'
import { Button, ConfirmDialog, Empty, Field, Icon, IconButton, inputCls, Modal, PageHeader, useToast } from '../ui'

export default function Catalogue() {
  const s = useStore()
  const toast = useToast()
  const [q, setQ] = useState('')
  const [upload, setUpload] = useState(false)
  const [del, setDel] = useState<{ productId: string; doc: PdfDoc; name: string } | null>(null)
  const replaceInput = useRef<HTMLInputElement>(null)
  const replaceTarget = useRef<{ productId: string; docId: string } | null>(null)
  const [f, setF] = useState<{ productId: string; name: string; type: PdfType; file: File | null; error: string }>({ productId: '', name: '', type: 'Product Datasheet', file: null, error: '' })
  const [busy, setBusy] = useState(false)
  const products = liveProducts(s)

  const rows = useMemo(() => products.flatMap(p => p.pdfDocuments.map(d => ({ p, d })))
    .filter(({ p, d }) => !q || `${d.name} ${p.name} ${p.code} ${categoryName(s, p.categoryId)}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => b.d.updatedAt.localeCompare(a.d.updatedAt)), [s, q])

  const doUpload = async () => {
    if (!f.productId) return setF({ ...f, error: 'Select a product' })
    if (!f.file) return setF({ ...f, error: 'Choose a PDF file' })
    try {
      validatePdf(f.file)
      setBusy(true)
      const ref = await storeFile(f.file)
      const t = new Date().toISOString()
      const doc: PdfDoc = { id: uid('pdf'), name: f.name.trim() || f.file.name.replace(/\.pdf$/i, ''), fileRef: ref, size: f.file.size, type: f.type, uploadedAt: t, updatedAt: t }
      await patchProduct(f.productId, p => ({ ...p, pdfDocuments: [...p.pdfDocuments, doc] }))
      toast('success', 'PDF uploaded — the download button is now live on the product page')
      setUpload(false)
      setF({ productId: '', name: '', type: 'Product Datasheet', file: null, error: '' })
    } catch (e) { setF(x => ({ ...x, error: e instanceof Error ? e.message : 'Upload failed' })) }
    finally { setBusy(false) }
  }
  const doReplace = async (file?: File) => {
    const t = replaceTarget.current
    if (replaceInput.current) replaceInput.current.value = ''
    if (!file || !t) return
    try {
      validatePdf(file)
      const ref = await storeFile(file)
      await patchProduct(t.productId, p => ({ ...p, pdfDocuments: p.pdfDocuments.map(d => (d.id === t.docId ? { ...d, fileRef: ref, size: file.size, updatedAt: new Date().toISOString() } : d)) }))
      toast('success', 'PDF replaced')
    } catch (e) { toast('error', e instanceof Error ? e.message : 'Replace failed') }
  }

  const A = 'w-9 h-9 inline-flex items-center justify-center rounded-lg text-[#5B6B78] hover:bg-[#EEF1F5] hover:text-[#0E2A47]'
  return (
    <>
      <PageHeader title="Catalogue / PDF Documents" subtitle="Upload catalogues and datasheets and attach them to products."
        actions={<Button variant="primary" icon="upload" onClick={() => setUpload(true)}>Upload PDF</Button>} />
      <input ref={replaceInput} type="file" hidden accept="application/pdf,.pdf" onChange={e => doReplace(e.target.files?.[0])} />
      <input className={`${inputCls} max-w-md mb-4`} placeholder="Search PDFs, products, categories…" aria-label="Search PDFs" value={q} onChange={e => setQ(e.target.value)} />

      <div className="bg-white border border-[#E3E8EF] rounded-xl overflow-hidden">
        {rows.length === 0 ? <Empty title="No PDFs found" text="Upload a catalogue or datasheet to attach it to a product." /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F7F8FA] text-left text-[11px] uppercase tracking-wider text-[#5B6B78]">
                <tr>{['PDF name', 'Product', 'Category', 'File type', 'Uploaded', 'Updated', 'Actions'].map(h => <th key={h} className="px-4 py-3 font-semibold whitespace-nowrap">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-[#EEF1F5]">
                {rows.map(({ p, d }) => {
                  const url = resolveRef(d.fileRef)
                  return (
                    <tr key={d.id}>
                      <td className="px-4 py-3"><div className="flex items-center gap-2"><Icon name="doc" className="w-5 h-5 text-[#E53935] shrink-0" /><div><div className="font-semibold text-[#0E2A47]">{d.name}</div><div className="text-[11px] text-[#7B8A99]">PDF · {fmtSize(d.size)}</div></div></div></td>
                      <td className="px-4 py-3"><Link to={`/admin/products/${p.id}/edit`} className="text-[#0E2A47] hover:text-[#B87A00]">{p.name}</Link></td>
                      <td className="px-4 py-3 text-[#5B6B78] whitespace-nowrap">{categoryName(s, p.categoryId)}</td>
                      <td className="px-4 py-3 text-xs whitespace-nowrap">{d.type}</td>
                      <td className="px-4 py-3 text-xs text-[#7B8A99] whitespace-nowrap">{fmtDate(d.uploadedAt)}</td>
                      <td className="px-4 py-3 text-xs text-[#7B8A99] whitespace-nowrap">{fmtDate(d.updatedAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-0.5">
                          <a href={url} target="_blank" rel="noopener noreferrer" className={A} aria-label="View" title="View"><Icon name="eye" className="w-[18px] h-[18px]" /></a>
                          <a href={url} download={`${d.name}.pdf`} className={A} aria-label="Download" title="Download"><Icon name="download" className="w-[18px] h-[18px]" /></a>
                          <IconButton icon="upload" label="Replace" onClick={() => { replaceTarget.current = { productId: p.id, docId: d.id }; replaceInput.current?.click() }} />
                          <IconButton icon="trash" label="Delete" danger onClick={() => setDel({ productId: p.id, doc: d, name: p.name })} />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {upload && (
        <Modal title="Upload PDF" onClose={() => setUpload(false)} footer={<><Button onClick={() => setUpload(false)}>Cancel</Button><Button variant="primary" disabled={busy} onClick={doUpload}>{busy ? 'Uploading…' : 'Upload'}</Button></>}>
          <div className="space-y-4">
            {f.error && <p role="alert" className="text-sm text-[#C62828] bg-[#FDECEC] rounded-lg px-3 py-2">{f.error}</p>}
            <Field label="Product" required>
              <select className={inputCls} value={f.productId} onChange={e => setF({ ...f, productId: e.target.value })}>
                <option value="">Select product…</option>
                {[...products].sort((a, b) => a.name.localeCompare(b.name)).map(p => <option key={p.id} value={p.id}>{p.name}{p.code ? ` (${p.code})` : ''}</option>)}
              </select>
            </Field>
            <Field label="Document type"><select className={inputCls} value={f.type} onChange={e => setF({ ...f, type: e.target.value as PdfType })}><option>Product Datasheet</option><option>Product Catalogue</option></select></Field>
            <Field label="PDF name" hint="Defaults to the file name."><input className={inputCls} value={f.name} onChange={e => setF({ ...f, name: e.target.value })} /></Field>
            <Field label="PDF file" required hint="Max 30 MB."><input type="file" accept="application/pdf,.pdf" className={inputCls} onChange={e => setF({ ...f, file: e.target.files?.[0] ?? null })} /></Field>
          </div>
        </Modal>
      )}
      {del && <ConfirmDialog danger title="Delete PDF?" confirmLabel="Delete PDF" onCancel={() => setDel(null)}
        message={<>Delete <b>{del.doc.name}</b> from <b>{del.name}</b>? The download button will disappear from the public page if it was the only PDF.</>}
        onConfirm={async () => { await patchProduct(del.productId, p => ({ ...p, pdfDocuments: p.pdfDocuments.filter(d => d.id !== del.doc.id) })); toast('success', 'PDF deleted'); setDel(null) }} />}
    </>
  )
}
