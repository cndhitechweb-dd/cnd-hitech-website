import { useSyncExternalStore } from 'react'
import { PRODUCTS as SEED_PRODUCTS, CATEGORY_GROUPS as SEED_GROUPS, type Product } from './products'
import { INDUSTRIES } from './industries'

/* ──────────────────────────────────────────────────────────────────────────
   Shared product data layer.
   One source of truth for the public site AND the admin panel.
   Persistence is isolated behind `Repository` (bottom of file). The default
   adapter is browser IndexedDB; replace it with an API/Supabase adapter to
   move to a real shared backend without touching any UI.
   ────────────────────────────────────────────────────────────────────────── */

export type Status = 'published' | 'draft' | 'hidden'
export type PdfType = 'Product Catalogue' | 'Product Datasheet'

export interface SpecRow { id: string; name: string; value: string }
export interface PdfDoc {
  id: string
  name: string
  fileRef: string
  size: number
  type: PdfType
  uploadedAt: string
  updatedAt: string
}
export interface TechAttributes {
  material: string
  threadType: string
  ipRating: string
  exClassification: string
  dimensions: string
  otherDetails: string
}
export interface AdminProduct {
  id: string
  name: string
  slug: string
  code: string
  categoryId: string
  subcategory: string
  shortDescription: string
  description: string
  features: string[]
  applications: string[]
  image: string
  gallery: string[]
  technicalSpecifications: SpecRow[]
  attributes: TechAttributes
  customFields: SpecRow[]
  certifications: string
  pdfDocuments: PdfDoc[]
  relatedIndustries: string[]
  status: Status
  archivedAt: string | null
  createdAt: string
  updatedAt: string
  shortName: string
  protectionTypes: string[]
  imgBg: string
}
export interface Category {
  id: string
  name: string
  slug: string
  description: string
  image: string
  status: 'active' | 'inactive'
  sortOrder: number
  subcategories: string[]
}
export interface Settings {
  notifications: { newEnquiry: boolean; productChanges: boolean; weeklySummary: boolean }
}
export interface StoreState {
  seedVersion: number
  products: AdminProduct[]
  categories: Category[]
  settings: Settings
  version: number
}

export const PLACEHOLDER_IMG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="#EEF1F5"/><g fill="none" stroke="#9AA9B8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="150" y="105" width="100" height="90" rx="8"/><circle cx="178" cy="132" r="9"/><path d="M155 188l32-32 22 22 14-14 22 22"/></g></svg>`,
  )

export const uid = (p = 'id') => `${p}-${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`
export const slugify = (s: string) =>
  s.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
const titleCase = (s: string) =>
  s.toLowerCase().replace(/(^|[\s(])([a-z])/g, (_, a, b) => a + b.toUpperCase()).replace(/ And /g, ' & ')

export const emptyAttributes = (): TechAttributes => ({
  material: '', threadType: '', ipRating: '', exClassification: '', dimensions: '', otherDetails: '',
})

/* ── Seeding from the existing public catalogue ───────────────────────────── */

const SEED_VERSION = 1
const SEED_DATE = '2026-08-01T09:00:00.000Z'

function buildSeed(): StoreState {
  const categories: Category[] = SEED_GROUPS.map((g, i) => ({
    id: `cat-${slugify(g.label)}`,
    name: titleCase(g.label),
    slug: slugify(g.label),
    description: '',
    image: '',
    status: 'active',
    sortOrder: i,
    subcategories: [...g.subcategories],
  }))
  const catFor = (sub: string) =>
    categories.find(c => c.subcategories.includes(sub)) ??
    categories.find(c => c.name.toUpperCase() === sub.toUpperCase()) ??
    categories[0]

  const products: AdminProduct[] = SEED_PRODUCTS.map((p, i) => {
    const cat = catFor(p.category)
    const groupLabel = SEED_GROUPS[categories.indexOf(cat)].label
    const industries = INDUSTRIES.filter(ind => ind.productGroupLabels.includes(groupLabel)).map(ind => ind.slug)
    const ts = new Date(Date.parse(SEED_DATE) + i * 60000).toISOString()
    return {
      id: p.id,
      name: p.name,
      slug: slugify(p.name),
      code: p.catNo,
      categoryId: cat.id,
      subcategory: cat.subcategories.includes(p.category) ? p.category : '',
      shortDescription: p.specSummary,
      description: p.description,
      features: [],
      applications: [],
      image: p.img ? `asset:${p.id}:img` : '',
      gallery: (p.extraImages ?? []).map((_, gi) => `asset:${p.id}:g${gi}`),
      technicalSpecifications: Object.entries(p.specs).map(([name, value]) => ({ id: uid('s'), name, value })),
      attributes: emptyAttributes(),
      customFields: [],
      certifications: '',
      pdfDocuments: p.pdfUrl
        ? [{
            id: uid('pdf'),
            name: `${p.catNo} Datasheet`,
            fileRef: `asset:${p.id}:pdf`,
            size: 0,
            type: 'Product Datasheet' as PdfType,
            uploadedAt: SEED_DATE,
            updatedAt: SEED_DATE,
          }]
        : [],
      relatedIndustries: industries,
      status: 'published' as Status,
      archivedAt: null,
      createdAt: SEED_DATE,
      updatedAt: ts,
      shortName: p.shortName,
      protectionTypes: p.protectionTypes,
      imgBg: p.imgBg,
    }
  })
  return {
    seedVersion: SEED_VERSION,
    products,
    categories,
    settings: { notifications: { newEnquiry: true, productChanges: false, weeklySummary: true } },
    version: 1,
  }
}

/* ── Repository (swap this for a real backend) ────────────────────────────── */

export interface Repository {
  loadState(): Promise<StoreState | null>
  saveState(state: StoreState): Promise<void>
  putFile(id: string, blob: Blob): Promise<void>
  deleteFile(id: string): Promise<void>
  loadFiles(): Promise<Map<string, Blob>>
  getAuth(): Promise<AuthRecord | null>
  setAuth(rec: AuthRecord): Promise<void>
  subscribeExternal(cb: () => void): () => void
  notifyExternal(): void
}
export interface AuthRecord { name: string; email: string; salt: string; hash: string }

function idb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('cnd-hitech', 1)
    req.onupgradeneeded = () => {
      req.result.createObjectStore('kv')
      req.result.createObjectStore('files')
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}
async function tx<T>(store: 'kv' | 'files', mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await idb()
  return new Promise((resolve, reject) => {
    const t = db.transaction(store, mode)
    const r = fn(t.objectStore(store))
    t.oncomplete = () => { db.close(); resolve(r.result) }
    t.onerror = () => { db.close(); reject(t.error) }
    t.onabort = () => { db.close(); reject(t.error) }
  })
}

const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('cnd-hitech-store') : null

const browserRepo: Repository = {
  loadState: async () => (await tx<StoreState | undefined>('kv', 'readonly', s => s.get('state'))) ?? null,
  saveState: async state => { await tx('kv', 'readwrite', s => s.put(state, 'state')) },
  putFile: async (id, blob) => { await tx('files', 'readwrite', s => s.put(blob, id)) },
  deleteFile: async id => { await tx('files', 'readwrite', s => s.delete(id)) },
  loadFiles: async () => {
    const db = await idb()
    return new Promise((resolve, reject) => {
      const out = new Map<string, Blob>()
      const t = db.transaction('files', 'readonly')
      const c = t.objectStore('files').openCursor()
      c.onsuccess = () => {
        const cur = c.result
        if (cur) { out.set(String(cur.key), cur.value as Blob); cur.continue() }
      }
      t.oncomplete = () => { db.close(); resolve(out) }
      t.onerror = () => { db.close(); reject(t.error) }
    })
  },
  getAuth: async () => (await tx<AuthRecord | undefined>('kv', 'readonly', s => s.get('auth'))) ?? null,
  setAuth: async rec => { await tx('kv', 'readwrite', s => s.put(rec, 'auth')) },
  subscribeExternal: cb => {
    if (!channel) return () => {}
    const h = () => cb()
    channel.addEventListener('message', h)
    return () => channel.removeEventListener('message', h)
  },
  notifyExternal: () => channel?.postMessage('changed'),
}

export const repo: Repository = browserRepo

/* ── In-memory store ──────────────────────────────────────────────────────── */

let state: StoreState = buildSeed()
let ready = false
const fileUrls = new Map<string, string>()
const listeners = new Set<() => void>()
let saveChain: Promise<void> = Promise.resolve()

const emit = () => listeners.forEach(l => l())

function adoptFiles(files: Map<string, Blob>) {
  fileUrls.forEach(u => URL.revokeObjectURL(u))
  fileUrls.clear()
  files.forEach((blob, id) => fileUrls.set(id, URL.createObjectURL(blob)))
}

export async function initStore(): Promise<void> {
  if (ready) return
  try {
    const [saved, files] = await Promise.all([repo.loadState(), repo.loadFiles()])
    adoptFiles(files)
    if (saved && saved.seedVersion === SEED_VERSION) state = saved
    else await repo.saveState(state)
  } catch (e) {
    console.warn('CND store: persistent storage unavailable, using in-memory catalogue', e)
  }
  ready = true
  repo.subscribeExternal(async () => {
    try {
      const [saved, files] = await Promise.all([repo.loadState(), repo.loadFiles()])
      adoptFiles(files)
      if (saved) state = saved
      emit()
    } catch { /* ignore */ }
  })
  emit()
}

export const getState = () => state
export function subscribe(l: () => void) {
  listeners.add(l)
  return () => listeners.delete(l)
}
export function useStore(): StoreState {
  return useSyncExternalStore(subscribe, getState)
}

/** Resolve a stored file reference (`file:<id>`) or bundled asset URL to a usable URL. */
export function resolveRef(ref: string | undefined | null): string {
  if (!ref) return ''
  if (ref.startsWith('file:')) return fileUrls.get(ref.slice(5)) ?? ''
  if (ref.startsWith('asset:')) {
    const [, id, key] = ref.split(':')
    const sp = SEED_PRODUCTS.find(p => p.id === id)
    if (!sp) return ''
    if (key === 'img') return sp.img
    if (key === 'pdf') return sp.pdfUrl ?? ''
    return sp.extraImages?.[Number(key.slice(1))] ?? ''
  }
  return ref
}
export const resolveImage = (ref: string | undefined | null) => resolveRef(ref) || PLACEHOLDER_IMG

function referencedFiles(s: StoreState): Set<string> {
  const refs = new Set<string>()
  const add = (r: string) => r?.startsWith('file:') && refs.add(r.slice(5))
  s.products.forEach(p => {
    add(p.image)
    p.gallery.forEach(add)
    p.pdfDocuments.forEach(d => add(d.fileRef))
  })
  s.categories.forEach(c => add(c.image))
  return refs
}

/** Apply a state change, persist it, and notify. Resolves once persisted. */
export function commit(mutator: (s: StoreState) => StoreState): Promise<void> {
  state = { ...mutator(state), version: state.version + 1 }
  const snapshot = state
  emit()
  saveChain = saveChain.then(async () => {
    await repo.saveState(snapshot)
    const used = referencedFiles(snapshot)
    for (const id of [...fileUrls.keys()]) {
      if (!used.has(id)) {
        URL.revokeObjectURL(fileUrls.get(id)!)
        fileUrls.delete(id)
        await repo.deleteFile(id)
      }
    }
    repo.notifyExternal()
  })
  return saveChain
}

/** Store an uploaded file and return its reference. */
export async function storeFile(blob: Blob): Promise<string> {
  const id = uid('f')
  await repo.putFile(id, blob)
  fileUrls.set(id, URL.createObjectURL(blob))
  return `file:${id}`
}

/* ── Mutations ────────────────────────────────────────────────────────────── */

const now = () => new Date().toISOString()

export function blankProduct(categoryId: string): AdminProduct {
  const t = now()
  return {
    id: uid('prod'), name: '', slug: '', code: '', categoryId, subcategory: '',
    shortDescription: '', description: '',
    features: [], applications: [], image: '', gallery: [],
    technicalSpecifications: [], attributes: emptyAttributes(), customFields: [],
    certifications: '', pdfDocuments: [], relatedIndustries: [],
    status: 'draft', archivedAt: null, createdAt: t, updatedAt: t,
    shortName: '', protectionTypes: [], imgBg: '#F2F4F7',
  }
}

export function uniqueSlug(base: string, id: string, products: AdminProduct[]) {
  const root = slugify(base) || 'product'
  let slug = root
  let n = 2
  while (products.some(p => p.slug === slug && p.id !== id)) slug = `${root}-${n++}`
  return slug
}

export function saveProduct(p: AdminProduct) {
  return commit(s => {
    const next: AdminProduct = {
      ...p,
      slug: uniqueSlug(p.slug || p.name, p.id, s.products),
      shortName: p.shortName || p.name,
      updatedAt: now(),
    }
    const exists = s.products.some(x => x.id === p.id)
    const products = exists ? s.products.map(x => (x.id === p.id ? next : x)) : [...s.products, next]
    const categories = s.categories.map(c =>
      c.id === next.categoryId && next.subcategory && !c.subcategories.includes(next.subcategory)
        ? { ...c, subcategories: [...c.subcategories, next.subcategory] }
        : c,
    )
    return { ...s, products, categories }
  })
}
export const patchProduct = (id: string, fn: (p: AdminProduct) => AdminProduct) =>
  commit(s => ({ ...s, products: s.products.map(p => (p.id === id ? { ...fn(p), updatedAt: now() } : p)) }))

export const archiveProduct = (id: string) => patchProduct(id, p => ({ ...p, archivedAt: now(), status: 'hidden' }))
export const restoreProduct = (id: string) => patchProduct(id, p => ({ ...p, archivedAt: null, status: 'draft' }))
export const deleteProductForever = (id: string) =>
  commit(s => ({ ...s, products: s.products.filter(p => p.id !== id) }))

export function duplicateProduct(id: string) {
  const newId = uid('prod')
  return commit(s => {
    const src = s.products.find(p => p.id === id)
    if (!src) return s
    const t = now()
    const copy: AdminProduct = {
      ...src,
      id: newId,
      name: `${src.name} (Copy)`,
      slug: uniqueSlug(`${src.name} copy`, newId, s.products),
      code: src.code ? `${src.code}-COPY` : '',
      status: 'draft',
      archivedAt: null,
      technicalSpecifications: src.technicalSpecifications.map(r => ({ ...r, id: uid('s') })),
      customFields: src.customFields.map(r => ({ ...r, id: uid('s') })),
      pdfDocuments: src.pdfDocuments.map(d => ({ ...d, id: uid('pdf') })),
      createdAt: t,
      updatedAt: t,
    }
    return { ...s, products: [...s.products, copy] }
  }).then(() => newId)
}

export function saveCategory(c: Category) {
  return commit(s => {
    const exists = s.categories.some(x => x.id === c.id)
    const categories = exists
      ? s.categories.map(x => (x.id === c.id ? c : x))
      : [...s.categories, { ...c, sortOrder: s.categories.length }]
    return { ...s, categories }
  })
}
export const moveCategory = (id: string, dir: -1 | 1) =>
  commit(s => {
    const list = [...s.categories].sort((a, b) => a.sortOrder - b.sortOrder)
    const i = list.findIndex(c => c.id === id)
    const j = i + dir
    if (i < 0 || j < 0 || j >= list.length) return s
    ;[list[i], list[j]] = [list[j], list[i]]
    return { ...s, categories: list.map((c, k) => ({ ...c, sortOrder: k })) }
  })
export const deleteCategory = (id: string) =>
  commit(s => ({ ...s, categories: s.categories.filter(c => c.id !== id) }))

export const saveSettings = (settings: Settings) => commit(s => ({ ...s, settings }))

/* ── Selectors ────────────────────────────────────────────────────────────── */

export const sortedCategories = (s: StoreState) => [...s.categories].sort((a, b) => a.sortOrder - b.sortOrder)
export const categoryName = (s: StoreState, id: string) => s.categories.find(c => c.id === id)?.name ?? 'Uncategorised'
export const hasImage = (p: { image: string }) => !!resolveRef(p.image)
export const hasFullDesc = (p: { description: string }) => !!p.description.trim()
export const hasPdf = (p: { pdfDocuments: unknown[] }) => p.pdfDocuments.length > 0
export const liveProducts = (s: StoreState) => s.products.filter(p => !p.archivedAt)

export function specTable(p: AdminProduct): Record<string, string> {
  const out: Record<string, string> = {}
  const add = (k: string, v: string) => { if (k.trim() && v.trim()) out[k.trim()] = v.trim() }
  p.technicalSpecifications.forEach(r => add(r.name, r.value))
  const a = p.attributes
  add('Material', a.material)
  add('Thread Type', a.threadType)
  add('IP Rating', a.ipRating)
  add('Ex Classification', a.exClassification)
  add('Dimensions', a.dimensions)
  add('Certifications', p.certifications.split('\n').filter(Boolean).join(', '))
  p.customFields.forEach(r => add(r.name, r.value))
  add('Other Details', a.otherDetails)
  return out
}

export type PublicProduct = Product & {
  features: string[]
  applications: string[]
  pdfs: { id: string; name: string; type: PdfType; url: string }[]
  categoryName: string
  groupLabel: string
}

export function toPublicProduct(s: StoreState, p: AdminProduct): PublicProduct {
  const cat = s.categories.find(c => c.id === p.categoryId)
  const groupLabel = (cat?.name ?? 'Other').toUpperCase()
  const pdfs = p.pdfDocuments
    .map(d => ({ id: d.id, name: d.name, type: d.type, url: resolveRef(d.fileRef) }))
    .filter(d => d.url)
  const imgs = [p.image, ...p.gallery].map(resolveRef).filter(Boolean)
  return {
    id: p.id,
    name: p.name || 'Untitled product',
    shortName: p.shortName || p.name,
    catNo: p.code || p.name,
    category: p.subcategory || groupLabel,
    protectionTypes: p.protectionTypes,
    specSummary: p.shortDescription,
    img: imgs[0] ?? PLACEHOLDER_IMG,
    extraImages: imgs.slice(1),
    imgBg: p.imgBg || '#F2F4F7',
    productShot: true,
    specs: specTable(p),
    pdfUrl: pdfs[0]?.url,
    description: p.description || p.shortDescription,
    features: p.features,
    applications: p.applications,
    pdfs,
    categoryName: cat?.name ?? 'Other',
    groupLabel,
  }
}

export interface PublicGroup { label: string; subcategories: string[]; description: string; image: string }
export interface PublicData {
  products: PublicProduct[]
  groups: PublicGroup[]
}

let publicCache: { version: number; data: PublicData } | null = null

/** What visitors may see: published, non-archived products in active categories. */
export function getPublicData(): PublicData {
  if (publicCache && publicCache.version === state.version) return publicCache.data
  const s = state
  const active = sortedCategories(s).filter(c => c.status === 'active')
  const activeIds = new Set(active.map(c => c.id))
  const products = liveProducts(s)
    .filter(p => p.status === 'published' && activeIds.has(p.categoryId))
    .map(p => toPublicProduct(s, p))
  const groups: PublicGroup[] = active.map(c => {
    const subs = [...c.subcategories]
    products.filter(p => p.groupLabel === c.name.toUpperCase() && p.category !== p.groupLabel).forEach(p => {
      if (!subs.includes(p.category)) subs.push(p.category)
    })
    return { label: c.name.toUpperCase(), subcategories: subs, description: c.description, image: resolveRef(c.image) }
  })
  const data = { products, groups }
  publicCache = { version: state.version, data }
  return data
}
export function usePublicData(): PublicData {
  useStore()
  return getPublicData()
}

export function industryProducts(slug: string): PublicProduct[] {
  const s = state
  const byId = new Map(getPublicData().products.map(p => [p.id, p]))
  return liveProducts(s)
    .filter(p => p.relatedIndustries.includes(slug))
    .map(p => byId.get(p.id))
    .filter((p): p is PublicProduct => !!p)
}

/* ── Quotation context (product / industry → quotation form) ──────────────── */

let quoteContext: { product?: { name: string; code: string }; industry?: string } = {}
export const setQuoteContext = (c: typeof quoteContext) => { quoteContext = c }
export const takeQuoteContext = () => { const c = quoteContext; quoteContext = {}; return c }

/* ── Auth (client-side session; see notes in admin/auth.ts) ───────────────── */
export const getAuthRecord = () => repo.getAuth()
export const setAuthRecord = (r: AuthRecord) => repo.setAuth(r)
