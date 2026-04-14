'use client'

import { Search, Globe, User, Mail, Phone, Shield } from 'lucide-react'

const stats = [
  { label: 'Consultas este mes', value: '1,248', change: '+12%', color: 'green' },
  { label: 'Módulos activos', value: '12 / 24', color: 'blue' },
  { label: 'Plataformas verificadas', value: '118', color: 'amber' },
  { label: 'Alertas activas', value: '3', color: 'red' },
]

const modules = [
  { name: 'IP Intelligence', desc: 'Geolocalización, ISP,Threats', icon: Search, href: '/dashboard/ip' },
  { name: 'Dominios', desc: 'WHOIS,dns,subdominios', icon: Globe, href: '/dashboard/domain' },
  { name: 'Username', desc: '85+ plataformas', icon: User, href: '/dashboard/username' },
  { name: 'Email', desc: 'Breaches,信息来源', icon: Mail, href: '/dashboard/email' },
  { name: 'Teléfono', desc: 'Operador,spam,apps', icon: Phone, href: '/dashboard/phone' },
  { name: 'Dark Web', desc: 'Monitoreo continuo', icon: Shield, href: '/dashboard/darkweb', pro: true },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.04)] rounded-lg p-4">
            <div className="text-xs text-[#666] mb-1">{stat.label}</div>
            <div className={`text-2xl font-bold ${
              stat.color === 'green' ? 'text-[#00ff41]' :
              stat.color === 'blue' ? 'text-[#00ffff]' :
              stat.color === 'amber' ? 'text-[#ffd700]' :
              'text-[#ff3333]'
            }`}>
              {stat.value}
              {stat.change && <span className="text-xs ml-2 text-[#00ff41]">{stat.change}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Search */}
      <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.04)] rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Búsqueda rápida</h2>
        <div className="flex gap-4">
          <input 
            type="text" 
            placeholder="IP, dominio, email, usuario..." 
            className="flex-1 bg-[#111] border border-[rgba(255,255,255,0.08)] rounded-lg px-4 py-2 text-white placeholder-[#666] focus:border-[#00ff41] focus:outline-none"
          />
          <button className="bg-[#00ff41] text-black px-6 py-2 rounded-lg font-semibold hover:opacity-90">
            Consultar
          </button>
        </div>
      </div>

      {/* Modules Grid */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Módulos disponibles</h2>
        <div className="grid grid-cols-3 gap-4">
          {modules.map((module) => (
            <a
              key={module.name}
              href={module.href}
              className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.04)] rounded-lg p-4 hover:border-[#00ff41] transition-colors group cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-lg bg-[#111] flex items-center justify-center group-hover:bg-[#00ff41]/10">
                  <module.icon className="w-5 h-5 text-[#00ff41]" />
                </div>
                {module.pro && (
                  <span className="text-xs bg-[#ffd700]/10 text-[#ffd700] px-2 py-0.5 rounded border border-[#ffd700]/30">
                    PRO
                  </span>
                )}
              </div>
              <div className="mt-3">
                <div className="text-white font-medium">{module.name}</div>
                <div className="text-xs text-[#666] mt-1">{module.desc}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}