import { useRef, useState } from 'react'
import { deleteCategory, liveProducts, moveCategory, resolveImage, saveCategory, slugify, sortedCategories, storeFile, uid, useStore, type Category } from '../../data/store'
import { optimizeImage } from '../lib'
import { Button, Card, ConfirmDialog, Empty, Field, IconButton, inputCls, Modal, PageHeader, StatusBadge, TagInput, useToast } from '../ui'

const blank = (): Category => ({ id: uid('cat'), name: '', slug: '', description: '', image: '', status: 'active', sortOrder: 0, subcategories: [] })

export default function Categories() {
  const s = useStore()
  const toast = useToast()
  const [edit, setEdit] = useState<Category | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [del, setDel] = useState<Category | null>(null)
  const [err, setErr] = useState('')
  const file = useRef<HTMLInputElement>(null)
  const cats = sortedCategories(s)
  const count = (id: string) => liveProducts(s).filter(p => p.categoryId === id).length

  const open = (c: Category | null) => { setErr(''); setIsNew(!c); setEdit(c ? { ...c, subcategories: [...c.subcategories] } : blank()) }
  const submit = async () => {
    if (!edit) return
    const name = edit.name.trim()
    if (!name) return setErr('Category name is required')
    if (cats.some(c => c.id !== edit.id && c.name.toLowerCase() === name.toLowerCase())) return setErr('A category with this name already exists')
    await saveCategory({ ...edit, name, slug: slugify(name) })
    toast('success', isNew ? 'Category added — it is now available on the public Products page' : 'Category updated')
    setEdit(null)
  }
  const upload = async (f?: File) => {
    if (!f || !edit) return
    try { setEdit({ ...edit, image: await storeFile(await optimizeImage(f)) }) }
    catch (e) { toast('error', e instanceof Error ? e.message : 'Upload failed') }
    if (file.current) file.current.value = ''
  }

  return (
    <>
      <PageHeader title="Categories" subtitle="Order, rename and activate the categories shown on the public Products page."
        actions={<Button variant="primary" icon="plus" onClick={() => open(null)}>Add Category</Button>} />
      <div className="bg-white border border-[#E3E8EF] rounded-xl overflow-hidden">
        {cats.length === 0 ? <Empty title="No categories" /> : (
          <ul className="divide-y divide-[#EEF1F5]">
            {cats.map((c, i) => (
              <li key={c.id} className="flex flex-wrap items-center gap-3 p-4">
                <div className="flex flex-col">
                  <IconButton icon="up" label="Move up" disabled={i === 0} onClick={() => moveCategory(c.id, -1)} />
                  <IconButton icon="down" label="Move down" disabled={i === cats.length - 1} onClick={() => moveCategory(c.id, 1)} />
                </div>
                <div className="w-12 h-12 rounded-lg bg-[#F4F6F9] border border-[#E3E8EF] overflow-hidden shrink-0">{c.image && <img src={resolveImage(c.image)} alt="" className="w-full h-full object-cover" />}</div>
                <div className="min-w-0 flex-1 basis-48">
                  <div className="font-semibold text-sm text-[#0E2A47]">{c.name}</div>
                  <div className="text-xs text-[#7B8A99]">{count(c.id)} products · {c.subcategories.length} series</div>
                </div>
                <StatusBadge status={c.status} />
                <div className="flex items-center gap-1 ml-auto">
                  <Button size="sm" onClick={() => saveCategory({ ...c, status: c.status === 'active' ? 'inactive' : 'active' }).then(() => toast('success', c.status === 'active' ? 'Category hidden from public site' : 'Category activated'))}>{c.status === 'active' ? 'Deactivate' : 'Activate'}</Button>
                  <IconButton icon="edit" label="Edit" onClick={() => open(c)} />
                  <IconButton icon="trash" label="Delete" danger onClick={() => setDel(c)} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Card className="mt-5"><p className="text-xs text-[#5B6B78]">Deactivating a category hides it and all its products from the public website; products stay intact here.</p></Card>

      {edit && (
        <Modal wide title={isNew ? 'Add Category' : 'Edit Category'} onClose={() => setEdit(null)}
          footer={<><Button onClick={() => setEdit(null)}>Cancel</Button><Button variant="primary" onClick={submit}>{isNew ? 'Add Category' : 'Save'}</Button></>}>
          <div className="space-y-4">
            {err && <p role="alert" className="text-sm text-[#C62828] bg-[#FDECEC] rounded-lg px-3 py-2">{err}</p>}
            <Field label="Name" required><input className={inputCls} value={edit.name} onChange={e => setEdit({ ...edit, name: e.target.value })} /></Field>
            <Field label="Description" hint="Shown on the public Products page. Leave blank to use the default text."><textarea className={inputCls} rows={3} value={edit.description} onChange={e => setEdit({ ...edit, description: e.target.value })} /></Field>
            <Field label="Subcategories / Series" hint="Press Enter to add. Products are grouped under these series on the public site."><TagInput values={edit.subcategories} onChange={v => setEdit({ ...edit, subcategories: v })} placeholder="e.g. CG-101 Series" /></Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Status"><select className={inputCls} value={edit.status} onChange={e => setEdit({ ...edit, status: e.target.value as Category['status'] })}><option value="active">Active</option><option value="inactive">Inactive</option></select></Field>
              <div>
                <span className="block text-xs font-semibold text-[#0E2A47] mb-1.5">Image (optional)</span>
                <input ref={file} type="file" hidden accept="image/jpeg,image/png,image/webp" onChange={e => upload(e.target.files?.[0])} />
                <div className="flex items-center gap-2">
                  {edit.image && <img src={resolveImage(edit.image)} alt="" className="w-10 h-10 rounded object-cover" />}
                  <Button size="sm" icon="upload" onClick={() => file.current?.click()}>{edit.image ? 'Replace' : 'Upload'}</Button>
                  {edit.image && <Button size="sm" variant="ghost" onClick={() => setEdit({ ...edit, image: '' })}>Remove</Button>}
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
      {del && (count(del.id) > 0 ? (
        <Modal title="Cannot delete category" onClose={() => setDel(null)} footer={<Button onClick={() => setDel(null)}>OK</Button>}>
          <p className="text-sm text-[#5B6B78]"><b>{del.name}</b> still contains {count(del.id)} product(s). Move them to another category first, or deactivate the category to hide it.</p>
        </Modal>
      ) : (
        <ConfirmDialog danger title="Delete category?" confirmLabel="Delete" message={<>Delete <b>{del.name}</b>? This cannot be undone.</>} onCancel={() => setDel(null)}
          onConfirm={async () => { await deleteCategory(del.id); toast('success', 'Category deleted'); setDel(null) }} />
      ))}
    </>
  )
}
