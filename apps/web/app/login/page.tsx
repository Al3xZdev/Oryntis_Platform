'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Activity } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  // Form states
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [registerName, setRegisterName] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [passwordStrength, setPasswordStrength] = useState(0)

  const checkPasswordStrength = (pw: string) => {
    let score = 0
    if (pw.length >= 8) score++
    if (/[A-Z]/.test(pw)) score++
    if (/[0-9]/.test(pw)) score++
    if (/[^A-Za-z0-9]/.test(pw)) score++
    setPasswordStrength(score)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('http://localhost:5000/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.detail || data.message || 'Error al iniciar sesión')
      }

      // Save token and user to localStorage (for session persistence)
      localStorage.setItem('oryntis_token', data.access_token)
      localStorage.setItem('oryntis_user', JSON.stringify(data.user))
      
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (registerPassword.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }
    
    setLoading(true)

    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: registerEmail, 
          password: registerPassword,
          name: registerName 
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.detail || data.message || 'Error al crear cuenta')
      }

      // Save token and user to localStorage
      localStorage.setItem('oryntis_token', data.access_token)
      localStorage.setItem('oryntis_user', JSON.stringify(data.user))
      
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Error al crear cuenta')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth
    window.location.href = 'http://localhost:5000/api/auth/google'
  }

  // Check for token in URL (from Google OAuth callback)
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const email = params.get('email')
    const name = params.get('name')
    
    if (token && email) {
      localStorage.setItem('oryntis_token', token)
      localStorage.setItem('oryntis_user', JSON.stringify({ email, name }))
      window.location.href = '/dashboard'
    }
  }

  const strengthLabels = ['', 'Débil', 'Regular', 'Buena', 'Fuerte']
  const strengthColors = ['', 'bg-[#ff3333]', 'bg-[#ffd700]', 'bg-[#00ff41]', 'bg-[#00ff41]']

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      {/* Background grid */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative z-10 w-full max-w-[400px]">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[rgba(0,255,65,0.06)] border border-[rgba(0,255,65,0.3)] flex items-center justify-center">
            <svg viewBox="0 0 17 17" fill="none" className="w-6 h-6">
              <circle cx="8.5" cy="8.5" r="3" stroke="#00ff41" strokeWidth="1.5"/>
              <circle cx="8.5" cy="8.5" r="6.5" stroke="#00ff41" strokeWidth="1" strokeDasharray="2.5 2"/>
              <circle cx="8.5" cy="8.5" r="1" fill="#00ff41"/>
            </svg>
          </div>
          <h1 className="text-[20px] font-bold text-[#00ff41] font-mono tracking-tight">Oryntis</h1>
          <p className="text-[13px] text-[#666]">OSINT Platform</p>
        </div>

        {/* Card */}
        <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.04)] rounded-xl p-6">
          {/* Tabs */}
          <div className="flex gap-0 mb-6 border-b border-[rgba(255,255,255,0.04)]">
            <button
              onClick={() => { setActiveTab('login'); setError('') }}
              className={`flex-1 py-2.5 text-[13px] font-medium cursor-pointer border-b-2 transition-all ${
                activeTab === 'login' 
                  ? 'text-[#00ff41] border-[#00ff41]' 
                  : 'text-[#666] border-transparent hover:text-[#999]'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => { setActiveTab('register'); setError('') }}
              className={`flex-1 py-2.5 text-[13px] font-medium cursor-pointer border-b-2 transition-all ${
                activeTab === 'register' 
                  ? 'text-[#00ff41] border-[#00ff41]' 
                  : 'text-[#666] border-transparent hover:text-[#999]'
              }`}
            >
              Crear Cuenta
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-[rgba(255,51,51,0.08)] border border-[rgba(255,51,51,0.3)] rounded-lg text-[11px] text-[#ff3333] text-center">
              {error}
            </div>
          )}

          {/* Login Form */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono text-[#666] uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="bg-[#111] border border-[rgba(255,255,255,0.04)] rounded-lg px-4 py-2.5 text-[13px] text-white outline-none focus:border-[rgba(0,255,65,0.3)] placeholder-[#666]"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono text-[#666] uppercase tracking-wider">Contraseña</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Tu contraseña"
                  className="bg-[#111] border border-[rgba(255,255,255,0.04)] rounded-lg px-4 py-2.5 text-[13px] text-white outline-none focus:border-[rgba(0,255,65,0.3)] placeholder-[#666]"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="h-10 bg-[#00ff41] rounded-lg text-black text-[13px] font-semibold cursor-pointer hover:opacity-85 disabled:opacity-40 mt-1"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>

              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-[rgba(255,255,255,0.04)]"></div>
                <span className="text-[10px] font-mono text-[#666] uppercase tracking-wider">o continuar con</span>
                <div className="flex-1 h-px bg-[rgba(255,255,255,0.04)]"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="h-10 bg-[#111] border border-[rgba(255,255,255,0.04)] rounded-lg text-[#ccc] text-[13px] font-medium cursor-pointer hover:border-[rgba(255,255,255,0.08)] flex items-center justify-center gap-2.5"
              >
                <svg viewBox="0 0 18 18" className="w-[18px] h-[18px]">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
                  <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
                </svg>
                Google
              </button>
            </form>
          )}

          {/* Register Form */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono text-[#666] uppercase tracking-wider">Nombre</label>
                <input
                  type="text"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  placeholder="Tu nombre"
                  className="bg-[#111] border border-[rgba(255,255,255,0.04)] rounded-lg px-4 py-2.5 text-[13px] text-white outline-none focus:border-[rgba(0,255,65,0.3)] placeholder-[#666]"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono text-[#666] uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="bg-[#111] border border-[rgba(255,255,255,0.04)] rounded-lg px-4 py-2.5 text-[13px] text-white outline-none focus:border-[rgba(0,255,65,0.3)] placeholder-[#666]"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono text-[#666] uppercase tracking-wider">Contraseña</label>
                <input
                  type="password"
                  value={registerPassword}
                  onChange={(e) => { setRegisterPassword(e.target.value); checkPasswordStrength(e.target.value) }}
                  placeholder="Mínimo 8 caracteres"
                  className="bg-[#111] border border-[rgba(255,255,255,0.04)] rounded-lg px-4 py-2.5 text-[13px] text-white outline-none focus:border-[rgba(0,255,65,0.3)] placeholder-[#666]"
                  minLength={8}
                  required
                />
                {/* Password strength */}
                <div className="flex gap-1 mt-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div 
                      key={i}
                      className={`flex-1 h-[3px] rounded transition-colors ${
                        passwordStrength > i ? strengthColors[passwordStrength] : 'bg-[#111]'
                      }`}
                    />
                  ))}
                </div>
                {registerPassword.length > 0 && (
                  <div className="text-[10px] font-mono text-[#666] text-right mt-0.5">
                    {strengthLabels[passwordStrength] || 'Muy débil'}
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="h-10 bg-[#00ff41] rounded-lg text-black text-[13px] font-semibold cursor-pointer hover:opacity-85 disabled:opacity-40 mt-1"
              >
                {loading ? 'Creando...' : 'Crear Cuenta'}
              </button>

              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-[rgba(255,255,255,0.04)]"></div>
                <span className="text-[10px] font-mono text-[#666] uppercase tracking-wider">o continuar con</span>
                <div className="flex-1 h-px bg-[rgba(255,255,255,0.04)]"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="h-10 bg-[#111] border border-[rgba(255,255,255,0.04)] rounded-lg text-[#ccc] text-[13px] font-medium cursor-pointer hover:border-[rgba(255,255,255,0.08)] flex items-center justify-center gap-2.5"
              >
                <svg viewBox="0 0 18 18" className="w-[18px] h-[18px]">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
                  <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
                </svg>
                Google
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-[11px] text-[#666]">
            Al crear una cuenta aceptás nuestros <span className="text-[#00ff41] cursor-pointer hover:underline">Términos de Servicio</span>
          </p>
        </div>
      </div>
    </div>
  )
}