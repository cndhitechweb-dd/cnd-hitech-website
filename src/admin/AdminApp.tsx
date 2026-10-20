import { useEffect, useState, type FormEvent } from 'react'
import { createBrowserRouter, Link, Navigate, NavLink, Outlet, RouterProvider, useLocation, useNavigate } from 'react-router'
import { LogoImage } from '../components/Logo'
import { createAdmin, hasAdminAccount, login, logout, useSession } from './auth'
import { Button, Field, Icon, inputCls, ToastProvider, useToast } from './ui'
import Dashboard from './pages/Dashboard'
import ProductsList from './pages/ProductsList'
import ProductForm from './pages/ProductForm'
import Categories from './pages/Categories'
import Catalogue from './pages/Catalogue'
import Media from './pages/Media'
import Specifications from './pages/Specifications'
import SettingsPage from './pages/Settings'

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: 'dashboard', end: true },
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
              <div className="text-[11px] text-[#7B8A99]">{session.email}</div>
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

function Login() {
  const session = useSession()
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()
  const [mode, setMode] = useState<'loading' | 'login' | 'setup'>('loading')
  const [f, setF] = useState({ name: '', email: '', password: '', confirm: '' })
  const [show, setShow] = useState(false)
  const [err, setErr] = useState<Partial<Record<'name' | 'email' | 'password' | 'confirm' | 'form', string>>>({})
  const [busy, setBusy] = useState(false)

  useEffect(() => { hasAdminAccount().then(has => setMode(has ? 'login' : 'setup')) }, [])
  useEffect(() => { document.title = 'Admin Login · CND HI-TECH CO.' }, [])
  if (session) return <Navigate to={(location.state as { from?: string } | null)?.from ?? '/admin'} replace />

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const errs: typeof err = {}
    if (mode === 'setup' && !f.name.trim()) errs.name = 'Name is required'
    if (!f.email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) errs.email = 'Enter a valid email address'
    if (!f.password) errs.password = 'Password is required'
    else if (mode === 'setup' && f.password.length < 10) errs.password = 'Use at least 10 characters'
    if (mode === 'setup' && f.confirm !== f.password) errs.confirm = 'Passwords do not match'
    setErr(errs)
    if (Object.keys(errs).length) return
    setBusy(true)
    try {
      if (mode === 'setup') {
        await createAdmin(f.name.trim(), f.email, f.password)
        toast('success', 'Admin account created')
        navigate('/admin', { replace: true })
      } else {
        const r = await login(f.email, f.password)
        if (r === 'invalid') setErr({ form: 'Invalid email or password.' })
        else if (r === 'locked') setErr({ form: 'Too many failed attempts. Please wait 30 seconds and try again.' })
        else navigate((location.state as { from?: string } | null)?.from ?? '/admin', { replace: true })
      }
    } catch (ex) {
      setErr({ form: ex instanceof Error ? ex.message : 'Something went wrong.' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#071829] flex items-center justify-center p-4 font-body relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(#F2A71B 1px, transparent 1px), linear-gradient(90deg, #F2A71B 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
      <div className="relative w-full max-w-md">
        <div className="flex justify-center mb-8"><LogoImage height={46} colorFilter="classic-red-white" /></div>
        <form onSubmit={submit} noValidate className="bg-white rounded-2xl shadow-2xl p-7 md:p-8 space-y-4">
          <div>
            <h1 className="font-display font-bold text-xl text-[#0E2A47]">{mode === 'setup' ? 'Create admin account' : 'Admin sign in'}</h1>
            <p className="text-sm text-[#5B6B78] mt-1">{mode === 'setup' ? 'No admin exists yet. Set up the first administrator.' : 'Product management for CND HI-TECH CO.'}</p>
          </div>
          {err.form && <div role="alert" className="flex gap-2 text-sm text-[#C62828] bg-[#FDECEC] rounded-lg px-3 py-2.5"><Icon name="alert" className="w-4 h-4 mt-0.5 shrink-0" />{err.form}</div>}
          {mode === 'loading' && <p className="text-sm text-[#5B6B78]">Loading…</p>}
          {mode !== 'loading' && (
            <>
              {mode === 'setup' && (
                <Field label="Full name" required error={err.name}>
                  <input className={inputCls} value={f.name} autoComplete="name" onChange={e => setF({ ...f, name: e.target.value })} />
                </Field>
              )}
              <Field label="Email" required error={err.email}>
                <input className={inputCls} type="email" value={f.email} autoComplete="username" onChange={e => setF({ ...f, email: e.target.value })} />
              </Field>
              <Field label="Password" required error={err.password}>
                <div className="relative">
                  <input className={`${inputCls} pr-11`} type={show ? 'text' : 'password'} value={f.password} autoComplete={mode === 'setup' ? 'new-password' : 'current-password'} onChange={e => setF({ ...f, password: e.target.value })} />
                  <button type="button" aria-label={show ? 'Hide password' : 'Show password'} onClick={() => setShow(s => !s)} className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-[#7B8A99] hover:text-[#0E2A47]"><Icon name={show ? 'eyeOff' : 'eye'} className="w-[18px] h-[18px]" /></button>
                </div>
              </Field>
              {mode === 'setup' && (
                <Field label="Confirm password" required error={err.confirm}>
                  <input className={inputCls} type={show ? 'text' : 'password'} value={f.confirm} autoComplete="new-password" onChange={e => setF({ ...f, confirm: e.target.value })} />
                </Field>
              )}
              <Button type="submit" variant="primary" className="w-full" disabled={busy}>{busy ? 'Please wait…' : mode === 'setup' ? 'Create account & sign in' : 'Login'}</Button>
            </>
          )}
        </form>
        <p className="text-center mt-5 text-xs text-[#5E7A96]"><a href="/" className="hover:text-white">← Back to website</a></p>
      </div>
    </div>
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

function Root() {
  return <ToastProvider><Outlet /></ToastProvider>
}

const router = createBrowserRouter([
  {
    path: '/admin',
    Component: Root,
    children: [
      { path: 'login', Component: Login },
      {
        Component: Shell,
        children: [
          { index: true, Component: Dashboard },
          { path: 'products', Component: ProductsList },
          { path: 'products/new', Component: ProductForm },
          { path: 'products/:id/edit', Component: ProductForm },
          { path: 'categories', Component: Categories },
          { path: 'catalogue', Component: Catalogue },
          { path: 'specifications', Component: Specifications },
          { path: 'media', Component: Media },
          { path: 'settings', Component: SettingsPage },
          { path: '*', Component: NotFound },
        ],
      },
    ],
  },
])

export default function AdminApp() {
  return <RouterProvider router={router} />
}
