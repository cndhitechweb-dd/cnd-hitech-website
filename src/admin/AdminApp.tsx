import { useEffect, useState, type FormEvent } from 'react'
import { Link, Navigate, NavLink, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router'
import { LogoImage } from '../components/Logo'
import { login, logout, useSession } from './auth'
import { Button, Field, Icon, inputCls, ToastProvider, useToast } from './ui'
import Dashboard from './pages/Dashboard'
import ProductsList from './pages/ProductsList'
import ProductForm from './pages/ProductForm'
import Categories from './pages/Categories'
import Catalogue from './pages/Catalogue'
import Media from './pages/Media'
import Specifications from './pages/Specifications'
import SettingsPage from './pages/Settings'
import AdminSubmissionsPage from '../admin/AdminSubmissionsPage'

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: 'dashboard', end: true },
  { to: '/admin/submissions', label: 'Enquiries', icon: 'mail' },
  { to: '/admin/products', label: 'Products', icon: 'box' },
  { to: '/admin/categories', label: 'Categories', icon: 'tag' },
  { to: '/admin/catalogue', label: 'Catalogue / PDFs', icon: 'doc' },
  { to: '/admin/specifications', label: 'Technical Specs', icon: 'table' },
  { to: '/admin/media', label: 'Media / Images', icon: 'image' },
  { to: '/admin/settings', label: 'Settings', icon: 'cog' },
]

function Shell() {
  const session = useSession()
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')

  useEffect(() => setOpen(false), [location.pathname])
  useEffect(() => {
    document.title = 'Admin · CND HI-TECH CO.'
    window.scrollTo(0, 0)
  }, [location.pathname])

  if (!session) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />

  const doLogout = () => { logout(); navigate('/admin/login', { replace: true }) }
  const submitSearch = (e: FormEvent) => {
    e.preventDefault()
    navigate(`/admin/products${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`)
  }

  const sidebar = (
    <div className="h-full flex flex-col bg-[#071829] text-[#AABDD0]">
      <div className="h-16 px-5 flex items-center border-b border-white/10 shrink-0">
        <LogoImage height={34} colorFilter="classic-red-white" />
      </div>
      <p className="px-5 pt-5 pb-2 text-[10px] font-bold tracking-[0.2em] text-[#5E7A96]">ADMIN PANEL</p>
      <nav className="flex-1 overflow-y-auto px-3 space-y-0.5">
        {NAV.map(n => (
          <NavLink key={n.to} to={n.to} end={n.end}
            className={({ isActive }) => `flex items-center gap-3 px-3 min-h-11 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-[#F2A71B] text-[#071829] font-semibold' : 'hover:bg-white/5 hover:text-white'}`}>
            <Icon name={n.icon} className="w-[18px] h-[18px]" />{n.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-white/10 space-y-0.5">
        <a href="/" className="flex items-center gap-3 px-3 min-h-11 rounded-lg text-sm hover:bg-white/5 hover:text-white"><Icon name="external" className="w-[18px] h-[18px]" />View public site</a>
        <button onClick={doLogout} className="w-full flex items-center gap-3 px-3 min-h-11 rounded-lg text-sm hover:bg-[#E53935]/15 hover:text-[#FF8A87]"><Icon name="logout" className="w-[18px] h-[18px]" />Logout</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F4F6F9] font-body text-[#0E2A47]">
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 z-30">{sidebar}</aside>
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-72 max-w-[85vw] h-full shadow-2xl">{sidebar}</div>
          <button aria-label="Close menu" className="flex-1 bg-[#071829]/60" onClick={() => setOpen(false)} />
        </div>
      )}
      <div className="lg:pl-64 min-h-screen flex flex-col">
        <header className="sticky top-0 z-20 h-16 bg-white border-b border-[#E3E8EF] px-4 md:px-6 flex items-center gap-3">
          <button className="lg:hidden w-11 h-11 -ml-2 flex items-center justify-center rounded-lg hover:bg-[#EEF1F5]" aria-label="Open menu" onClick={() => setOpen(true)}><Icon name="menu" /></button>
          <form onSubmit={submitSearch} className="flex-1 max-w-md relative" role="search">
            <Icon name="search" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA9B8]" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search products, codes, keywords…" aria-label="Search products" className={`${inputCls} pl-9`} />
          </form>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden sm:block text-right leading-tight">
              <div className="text-sm font-semibold">{session.name}</div>
              <div className="text-[11px] text-[#7B8A99]">{session.username}</div>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#0E2A47] text-[#F2A71B] font-display font-bold text-sm flex items-center justify-center">{session.name.slice(0, 1).toUpperCase()}</div>
            <Button size="sm" icon="logout" onClick={doLogout} className="hidden sm:inline-flex">Logout</Button>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1400px] w-full"><Outlet /></main>
      </div>
    </div>
  )
}

function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#071829] flex items-center justify-center p-4 font-body relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(#F2A71B 1px, transparent 1px), linear-gradient(90deg, #F2A71B 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
      <div className="relative w-full max-w-sm">
        <div className="flex justify-center mb-8"><LogoImage height={46} colorFilter="classic-red-white" /></div>
        {children}
        <p className="text-center mt-5 text-xs text-[#5E7A96]"><a href="/" className="hover:text-white">← Back to website</a></p>
      </div>
    </div>
  )
}

function Login() {
  const session = useSession()
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()
  const [f, setF] = useState({ username: '', password: '' })
  const [show, setShow] = useState(false)
  const [err, setErr] = useState<Partial<Record<'username' | 'password' | 'form', string>>>({})
  const [busy, setBusy] = useState(false)

  useEffect(() => { document.title = 'Admin Login · CND HI-TECH CO.' }, [])
  if (session) return <Navigate to={(location.state as { from?: string } | null)?.from ?? '/admin'} replace />

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const errs: typeof err = {}
    if (!f.username.trim()) errs.username = 'Username is required'
    if (!f.password) errs.password = 'Password is required'
    setErr(errs)
    if (Object.keys(errs).length) return
    setBusy(true)
    try {
      const r = await login(f.username, f.password)
      if (r === 'invalid') setErr({ form: 'Invalid username or password.' })
      else if (r === 'locked') setErr({ form: 'Too many failed attempts. Please wait 30 seconds and try again.' })
      else if (r === 'not-configured') setErr({ form: 'Admin credentials are not configured. Set VITE_ADMIN_USERNAME and VITE_ADMIN_PASSWORD in Vercel environment variables.' })
      else {
        toast('success', 'Signed in')
        navigate((location.state as { from?: string } | null)?.from ?? '/admin', { replace: true })
      }
    } catch (ex) {
      setErr({ form: ex instanceof Error ? ex.message : 'Something went wrong.' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthShell>
      <form onSubmit={submit} noValidate className="bg-white rounded-2xl shadow-2xl p-7 md:p-8 space-y-4">
        <div>
          <h1 className="font-display font-bold text-xl text-[#0E2A47]">Admin sign in</h1>
          <p className="text-sm text-[#5B6B78] mt-1">Product management for CND HI-TECH CO.</p>
        </div>
        {err.form && <div role="alert" className="flex gap-2 text-sm text-[#C62828] bg-[#FDECEC] rounded-lg px-3 py-2.5"><Icon name="alert" className="w-4 h-4 mt-0.5 shrink-0" />{err.form}</div>}
        <Field label="Username" required error={err.username}>
          <input className={inputCls} value={f.username} autoComplete="username" autoFocus onChange={e => setF({ ...f, username: e.target.value })} />
        </Field>
        <Field label="Password" required error={err.password}>
          <div className="relative">
            <input className={`${inputCls} pr-11`} type={show ? 'text' : 'password'} value={f.password} autoComplete="current-password" onChange={e => setF({ ...f, password: e.target.value })} />
            <button type="button" aria-label={show ? 'Hide' : 'Show'} onClick={() => setShow(s => !s)} className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-[#7B8A99] hover:text-[#0E2A47]"><Icon name={show ? 'eyeOff' : 'eye'} className="w-[18px] h-[18px]" /></button>
          </div>
        </Field>
        <Button type="submit" variant="primary" className="w-full" disabled={busy}>
          {busy ? 'Please wait…' : 'Login'}
        </Button>
      </form>
    </AuthShell>
  )
}

function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="font-display font-bold text-2xl text-[#0E2A47] mb-2">Page not found</h1>
      <Link to="/admin" className="text-sm font-semibold text-[#D4920F] hover:underline">Back to dashboard</Link>
    </div>
  )
}


export default function AdminApp() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route element={<Shell />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductsList />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/:id/edit" element={<ProductForm />} />
          <Route path="categories" element={<Categories />} />
          <Route path="catalogue" element={<Catalogue />} />
          <Route path="specifications" element={<Specifications />} />
          <Route path="media" element={<Media />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="submissions" element={<AdminSubmissionsPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ToastProvider>
  )
}
