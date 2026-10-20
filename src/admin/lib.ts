/** Allow-list HTML sanitiser for the technical-description editor and public rendering. */
const ALLOWED = new Set(['H2', 'H3', 'H4', 'P', 'BR', 'B', 'STRONG', 'I', 'EM', 'U', 'UL', 'OL', 'LI', 'TABLE', 'THEAD', 'TBODY', 'TR', 'TH', 'TD', 'DIV', 'SPAN'])

export function sanitizeHtml(html: string): string {
  if (!html) return ''
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html')
  const walk = (node: Element) => {
    for (const child of [...node.children]) {
      if (!ALLOWED.has(child.tagName)) {
        if (['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED'].includes(child.tagName)) { child.remove(); continue }
        child.replaceWith(...child.childNodes)
        continue
      }
      for (const attr of [...child.attributes]) {
        const keep = (child.tagName === 'TD' || child.tagName === 'TH') && (attr.name === 'colspan' || attr.name === 'rowspan')
        if (!keep) child.removeAttribute(attr.name)
      }
      walk(child)
    }
  }
  // re-walk until stable because unwrap moves children up
  for (let i = 0; i < 3; i++) walk(doc.body)
  return doc.body.innerHTML
}

export const stripHtml = (html: string) => html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const MAX_IMAGE_BYTES = 12 * 1024 * 1024
export const MAX_PDF_BYTES = 30 * 1024 * 1024

/** Validate, downscale (max 1600px, aspect ratio preserved) and re-encode as WebP. */
export async function optimizeImage(file: File): Promise<Blob> {
  if (!IMAGE_TYPES.includes(file.type)) throw new Error('Unsupported format. Use JPG, JPEG, PNG or WEBP.')
  if (file.size > MAX_IMAGE_BYTES) throw new Error('Image is larger than 12 MB.')
  const bmp = await createImageBitmap(file)
  const scale = Math.min(1, 1600 / Math.max(bmp.width, bmp.height))
  const w = Math.round(bmp.width * scale)
  const h = Math.round(bmp.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  canvas.getContext('2d')!.drawImage(bmp, 0, 0, w, h)
  bmp.close()
  const blob = await new Promise<Blob | null>(res => canvas.toBlob(res, 'image/webp', 0.88))
  if (!blob) throw new Error('Could not process this image.')
  return blob.size < file.size || scale < 1 ? blob : file
}

export function validatePdf(file: File) {
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) throw new Error('Only PDF files are allowed.')
  if (file.size > MAX_PDF_BYTES) throw new Error('PDF is larger than 30 MB.')
}

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
export const fmtSize = (b: number) => (b ? (b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`) : '—')

import { patchProduct, resolveRef, storeFile } from '../data/store'

export async function uploadProductImage(productId: string, file: File) {
  const ref = await storeFile(await optimizeImage(file))
  await patchProduct(productId, p => (resolveRef(p.image) ? { ...p, gallery: [...p.gallery, ref] } : { ...p, image: ref }))
}
