'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Home, Search, User, Mail, Phone, Globe, Shield,
  Key, Server, Database, Clock, AlertTriangle, FileText,
  LayoutDashboard, Lock, CreditCard, Activity, LogOut, User as UserIcon, ChevronDown
} from 'lucide-react'

const navigation = [
  { name: 'Inicio', href: '/dashboard', icon: Home },
  { name: 'IP Intelligence', href: '/dashboard/ip', icon: Search },
  { name: 'Dominios', href: '/dashboard/domain', icon: Globe },
  { name: 'Username', href: '/dashboard/username', icon: User },
  { name: 'Email', href: '/dashboard/email', icon: Mail },
  { name: 'Teléfono', href: '/dashboard/phone', icon: Phone },
  { name: 'Personas', href: '/dashboard/personas', icon: User },
]

const tools = [
  { name: 'Google Dorks', href: '/dashboard/dorks', icon: Search },
  { name: 'SSL/TLS', href: '/dashboard/ssl', icon: Lock },
  { name: 'WHOIS', href: '/dashboard/whois', icon: Database },
  { name: 'Breaches', href: '/dashboard/breach', icon: AlertTriangle },
  { name: 'Metadatos', href: '/dashboard/metadata', icon: FileText },
  { name: 'Wayback', href: '/dashboard/wayback', icon: Clock },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Get user from localStorage
  const [user, setUser] = useState<any>({ credits: 1000 })
  
  useEffect(() => {
    const storedUser = localStorage.getItem('oryntis_user')
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser({ ...parsedUser, credits: parsedUser.credits || 1000 })
    }
  }, [])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('oryntis_token')
    localStorage.removeItem('oryntis_user')
    router.push('/login')
  }

  const getInitial = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase()
    if (user?.email) return user.email.charAt(0).toUpperCase()
    return 'U'
  }

  return (
    <div className="flex h-screen bg-[#050505]">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-[#0a0a0a] border-r border-[rgba(255,255,255,0.04)] flex flex-col transition-all duration-300`}>
        {/* Logo */}
        <div className="h-14 flex items-center px-4 border-b border-[rgba(255,255,255,0.04)]">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00ff41] shadow-[0_0_8px_#00ff41] animate-pulse"></div>
            <span className="text-white font-semibold">Oryntis</span>
          </Link>
        </div>

        {/* Navigation - Módulos */}
        <div className="py-4">
          <div className="px-4 mb-2 text-[9px] uppercase tracking-wider text-[#666] font-mono">
            Módulos
          </div>
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center px-4 py-2 text-[#ccc] hover:bg-[#111] hover:text-[#00ff41] transition-colors"
            >
              <item.icon className="w-4 h-4" />
              <span className="ml-3 text-sm">{item.name}</span>
            </Link>
          ))}
        </div>

        {/* Navigation - Herramientas */}
        <div className="py-4 border-t border-[rgba(255,255,255,0.04)]">
          <div className="px-4 mb-2 text-[9px] uppercase tracking-wider text-[#666] font-mono">
            Herramientas
          </div>
          {tools.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center px-4 py-2 text-[#ccc] hover:bg-[#111] hover:text-[#00ff41] transition-colors"
            >
              <item.icon className="w-4 h-4" />
              <span className="ml-3 text-sm">{item.name}</span>
            </Link>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-14 bg-[#0a0a0a] border-b border-[rgba(255,255,255,0.04)] flex items-center justify-between px-6">
          <div className="text-sm text-[#999]">
            Dashboard <span className="text-[#666]">/</span> Inicio
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Activity className="w-4 h-4 text-[#00ff41]" />
              <span className="text-[#00ff41]">{user?.credits || 1000} créditos</span>
            </div>
            
            {/* User Menu */}
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 rounded-full bg-[#111] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-white font-medium">
                  {getInitial()}
                </div>
                <ChevronDown className={`w-4 h-4 text-[#666] transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-[#0a0a0a] border border-[rgba(255,255,255,0.08)] rounded-lg shadow-lg overflow-hidden z-50">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.04)]">
                    <div className="text-sm font-medium text-white">{user?.name || 'Usuario'}</div>
                    <div className="text-xs text-[#666]">{user?.email || 'usuario@email.com'}</div>
                    <div className="mt-2 inline-block px-2 py-0.5 bg-[rgba(0,255,65,0.08)] border border-[rgba(0,255,65,0.2)] rounded text-[10px] text-[#00ff41] font-mono uppercase">
                      {user?.plan || 'free'} Plan
                    </div>
                  </div>
                  
                  {/* Menu Items */}
                  <div className="py-1">
                    <button className="w-full px-4 py-2 text-left text-sm text-[#ccc] hover:bg-[#111] hover:text-[#00ff41] flex items-center gap-2 transition-colors">
                      <UserIcon className="w-4 h-4" />
                      Mi Perfil
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-[#ccc] hover:bg-[#111] hover:text-[#00ff41] flex items-center gap-2 transition-colors">
                      <CreditCard className="w-4 h-4" />
                      Planes y Precios
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-[rgba(255,255,255,0.04)] py-1">
                    <button 
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-[#ff3333] hover:bg-[rgba(255,51,51,0.08)] flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </main>
    </div>
  )
}