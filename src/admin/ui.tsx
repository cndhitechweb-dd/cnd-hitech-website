import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import type { Status } from '../data/store'

export const inputCls =
  'w-full px-3 py-2.5 text-sm bg-white border border-[#D5DCE5] rounded-lg text-[#0E2A47] placeholder-[#9AA9B8] focus:outline-none focus:border-[#F2A71B] focus:ring-2 focus:ring-[#F2A71B]/25 transition'

const ICONS: Record<string, string> = {
  dashboard: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z',
  box: 'M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9',
  tag: 'M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3zM6 6h.008v.008H6V6z',
  doc: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
  image: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A1.5 1.5 0 0021.75 19.5V4.5A1.5 1.5 0 0020.25 3H3.75A1.5 1.5 0 002.25 4.5v15A1.5 1.5 0 003.75 21zM13.5 8.25h.008v.008H13.5V8.25z',
  cog: 'M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894zM15 12a3 3 0 11-6 0 3 3 0 016 0z',
  logout: 'M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9',
  search: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z',
  plus: 'M12 4.5v15m7.5-7.5h-15',
  eye: 'M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178zM15 12a3 3 0 11-6 0 3 3 0 016 0z',
  eyeOff: 'M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88',
  edit: 'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125',
  copy: 'M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75',
  trash: 'M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0',
  download: 'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3',
  upload: 'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5',
  menu: 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5',
  x: 'M6 18L18 6M6 6l12 12',
  up: 'M4.5 15.75l7.5-7.5 7.5 7.5',
  down: 'M19.5 8.25l-7.5 7.5-7.5-7.5',
  check: 'M4.5 12.75l6 6 9-13.5',
  star: 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z',
  table: 'M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5',
  external: 'M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25',
  alert: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.008v.008H12v-.008z',
  restore: 'M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3',
}
export function Icon({ name, className = 'w-5 h-5' }: { name: keyof typeof ICONS | string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  )
}

type BtnVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'dark'
const BTN: Record<BtnVariant, string> = {
  primary: 'bg-[#F2A71B] text-[#0E2A47] hover:bg-[#D4920F] font-bold',
  dark: 'bg-[#0E2A47] text-white hover:bg-[#163A5F] font-semibold',
  secondary: 'bg-white text-[#0E2A47] border border-[#D5DCE5] hover:bg-[#F4F6F9] font-semibold',
  danger: 'bg-[#E53935] text-white hover:bg-[#C62828] font-semibold',
  ghost: 'text-[#5B6B78] hover:bg-[#EEF1F5] hover:text-[#0E2A47] font-medium',
}
export function Button({
  variant = 'secondary', size = 'md', icon, children, className = '', ...rest
}: { variant?: BtnVariant; size?: 'sm' | 'md'; icon?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2A71B] ${size === 'sm' ? 'min-h-9 px-3 text-xs' : 'min-h-11 md:min-h-10 px-4 text-sm'} ${BTN[variant]} ${className}`}
    >
      {icon && <Icon name={icon} className="w-4 h-4" />}
      {children}
    </button>
  )
}
export function IconButton({ icon, label, danger, ...rest }: { icon: string; label: string; danger?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      {...rest}
      className={`w-9 h-9 inline-flex items-center justify-center rounded-lg transition-colors disabled:opacity-40 ${danger ? 'text-[#E53935] hover:bg-[#FDECEC]' : 'text-[#5B6B78] hover:bg-[#EEF1F5] hover:text-[#0E2A47]'}`}
    >
      <Icon name={icon} className="w-[18px] h-[18px]" />
    </button>
  )
}

export function Field({ label, required, hint, error, children, className = '' }: { label: string; required?: boolean; hint?: string; error?: string; children: ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-xs font-semibold text-[#0E2A47] mb-1.5">
        {label}{required && <span className="text-[#E53935] ml-0.5">*</span>}
      </span>
      {children}
      {hint && !error && <span className="block mt-1 text-[11px] text-[#7B8A99]">{hint}</span>}
      {error && <span className="block mt-1 text-[11px] text-[#E53935]" role="alert">{error}</span>}
    </label>
  )
}

export function Card({ title, action, children, className = '' }: { title?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`bg-white border border-[#E3E8EF] rounded-xl ${className}`}>
      {title && (
        <header className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-[#EEF1F5]">
          <h2 className="font-display font-semibold text-[#0E2A47] text-sm">{title}</h2>
          {action}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  )
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
      <div>
        <h1 className="font-display font-bold text-[#0E2A47] text-xl md:text-2xl">{title}</h1>
        {subtitle && <p className="text-sm text-[#5B6B78] mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

const STATUS_STYLE: Record<string, string> = {
  published: 'bg-[#E6F6EC] text-[#17803D]',
  draft: 'bg-[#FFF3D6] text-[#9A6700]',
  hidden: 'bg-[#EEF1F5] text-[#5B6B78]',
  archived: 'bg-[#FDECEC] text-[#C62828]',
  active: 'bg-[#E6F6EC] text-[#17803D]',
  inactive: 'bg-[#EEF1F5] text-[#5B6B78]',
}
export function StatusBadge({ status }: { status: Status | 'archived' | 'active' | 'inactive' }) {
  return <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize ${STATUS_STYLE[status]}`}>{status}</span>
}

export function Modal({ title, onClose, children, footer, wide }: { title: string; onClose: () => void; children: ReactNode; footer?: ReactNode; wide?: boolean }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])
  return (
    <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#071829]/60" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label={title} className={`bg-white w-full ${wide ? 'sm:max-w-3xl' : 'sm:max-w-md'} max-h-[92vh] flex flex-col rounded-t-2xl sm:rounded-2xl shadow-2xl`}>
        <header className="flex items-center justify-between px-5 py-4 border-b border-[#EEF1F5]">
          <h3 className="font-display font-semibold text-[#0E2A47]">{title}</h3>
          <IconButton icon="x" label="Close" onClick={onClose} />
        </header>
        <div className="p-5 overflow-y-auto">{children}</div>
        {footer && <footer className="px-5 py-3.5 border-t border-[#EEF1F5] flex flex-wrap justify-end gap-2">{footer}</footer>}
      </div>
    </div>
  )
}

/* Confirm dialog */
export function ConfirmDialog({ title, message, confirmLabel = 'Confirm', danger, onConfirm, onCancel }: {
  title: string; message: ReactNode; confirmLabel?: string; danger?: boolean; onConfirm: () => void | Promise<void>; onCancel: () => void
}) {
  const [busy, setBusy] = useState(false)
  return (
    <Modal title={title} onClose={onCancel} footer={
      <>
        <Button onClick={onCancel}>Cancel</Button>
        <Button variant={danger ? 'danger' : 'primary'} disabled={busy} onClick={async () => { setBusy(true); try { await onConfirm() } finally { setBusy(false) } }}>{confirmLabel}</Button>
      </>
    }>
      <div className="flex gap-3">
        {danger && <div className="w-10 h-10 shrink-0 rounded-full bg-[#FDECEC] text-[#E53935] flex items-center justify-center"><Icon name="alert" /></div>}
        <div className="text-sm text-[#5B6B78] leading-relaxed">{message}</div>
      </div>
    </Modal>
  )
}

/* Toasts */
type Toast = { id: number; kind: 'success' | 'error'; text: string }
const ToastCtx = createContext<(kind: Toast['kind'], text: string) => void>(() => {})
export const useToast = () => useContext(ToastCtx)
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([])
  const n = useRef(0)
  const push = useCallback((kind: Toast['kind'], text: string) => {
    const id = ++n.current
    setItems(i => [...i, { id, kind, text }])
    setTimeout(() => setItems(i => i.filter(t => t.id !== id)), 4200)
  }, [])
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed z-[100] bottom-4 right-4 left-4 sm:left-auto flex flex-col gap-2 sm:w-80" aria-live="polite">
        {items.map(t => (
          <div key={t.id} className={`flex items-start gap-2.5 px-4 py-3 rounded-lg shadow-lg text-sm text-white ${t.kind === 'success' ? 'bg-[#17803D]' : 'bg-[#C62828]'}`}>
            <Icon name={t.kind === 'success' ? 'check' : 'alert'} className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{t.text}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export function Empty({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="text-center py-14 px-4">
      <p className="font-display font-semibold text-[#0E2A47]">{title}</p>
      {text && <p className="text-sm text-[#5B6B78] mt-1 mb-4">{text}</p>}
      {action}
    </div>
  )
}

export function Pagination({ page, pages, onChange, total }: { page: number; pages: number; onChange: (p: number) => void; total: number }) {
  if (total === 0) return null
  return (
    <div className="flex items-center justify-between gap-3 px-1 pt-4 text-xs text-[#5B6B78]">
      <span>{total} result{total === 1 ? '' : 's'} · Page {page} of {pages}</span>
      <div className="flex gap-2">
        <Button size="sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>Previous</Button>
        <Button size="sm" disabled={page >= pages} onClick={() => onChange(page + 1)}>Next</Button>
      </div>
    </div>
  )
}

export function TagInput({ values, onChange, placeholder }: { values: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [text, setText] = useState('')
  const add = () => {
    const t = text.trim()
    if (t && !values.includes(t)) onChange([...values, t])
    setText('')
  }
  return (
    <div>
      <div className="flex gap-2">
        <input className={inputCls} value={text} placeholder={placeholder} onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add() } }} />
        <Button onClick={add} icon="plus">Add</Button>
      </div>
      {values.length > 0 && (
        <ul className="flex flex-wrap gap-2 mt-2.5">
          {values.map(v => (
            <li key={v} className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 bg-[#EEF1F5] text-[#0E2A47] text-xs font-medium rounded-full">
              {v}
              <button type="button" aria-label={`Remove ${v}`} onClick={() => onChange(values.filter(x => x !== v))} className="w-5 h-5 rounded-full hover:bg-[#D5DCE5] flex items-center justify-center"><Icon name="x" className="w-3 h-3" /></button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function ListEditor({ values, onChange, placeholder }: { values: string[]; onChange: (v: string[]) => void; placeholder: string }) {
  return (
    <div className="space-y-2">
      {values.map((v, i) => (
        <div key={i} className="flex gap-2">
          <input className={inputCls} value={v} placeholder={placeholder} onChange={e => onChange(values.map((x, j) => (j === i ? e.target.value : x)))} />
          <IconButton icon="trash" label="Remove" danger onClick={() => onChange(values.filter((_, j) => j !== i))} />
        </div>
      ))}
      <Button size="sm" icon="plus" onClick={() => onChange([...values, ''])}>Add item</Button>
    </div>
  )
}

export function StatusChip({ ok, okLabel, missingLabel }: { ok: boolean; okLabel: string; missingLabel: string }) {
  return ok
    ? <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#17803D] whitespace-nowrap"><span aria-hidden="true">✓</span>{okLabel}</span>
    : <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#9A6700] whitespace-nowrap"><span aria-hidden="true">⚠</span>{missingLabel}</span>
}

export function ProductThumb({ src, bg, size = 'w-12 h-12' }: { src: string; bg?: string; size?: string }) {
  return src ? (
    <div className={`${size} rounded-lg overflow-hidden border border-[#E3E8EF] shrink-0`} style={{ background: bg }}><img src={src} alt="" loading="lazy" className="w-full h-full object-contain p-1" /></div>
  ) : (
    <div className={`${size} rounded-lg border border-dashed border-[#E0B04A] bg-[#FFF8E6] shrink-0 flex flex-col items-center justify-center text-[#9A6700]`} aria-label="Image missing">
      <Icon name="image" className="w-4 h-4" /><span className="text-[8px] font-bold leading-tight mt-0.5 text-center">Image Missing</span>
    </div>
  )
}
