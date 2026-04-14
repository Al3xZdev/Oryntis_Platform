'use client'

import { useState } from 'react'
import { Phone, Shield, MapPin, User, MessageCircle, AlertTriangle } from 'lucide-react'
import { 
  FaWhatsapp, FaTelegram, FaComment, FaLock, FaViber, 
  FaFacebook, FaInstagram, FaLinkedin 
} from 'react-icons/fa'

// Iconos para aplicaciones usando react-icons
const APP_ICONS: Record<string, any> = {
  'WhatsApp': FaWhatsapp,
  'Telegram': FaTelegram,
  'iMessage': FaComment,
  'Signal': FaLock,
  'Viber': FaViber,
  'Facebook': FaFacebook,
  'Instagram': FaInstagram,
  'LinkedIn': FaLinkedin,
}

// Estilos de color para cada app
const APP_STYLES: Record<string, { bg: string, text: string }> = {
  'WhatsApp': { bg: 'bg-[#25D366]', text: 'text-white' },
  'Telegram': { bg: 'bg-[#0088CC]', text: 'text-white' },
  'iMessage': { bg: 'bg-[#32D74B]', text: 'text-white' },
  'Signal': { bg: 'bg-[#3A76F0]', text: 'text-white' },
  'Viber': { bg: 'bg-[#7360F2]', text: 'text-white' },
  'Facebook': { bg: 'bg-[#1877F2]', text: 'text-white' },
  'Instagram': { bg: 'bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737]', text: 'text-white' },
  'LinkedIn': { bg: 'bg-[#0A66C2]', text: 'text-white' },
}

// Función para obtener el icono de una app
const getAppIcon = (appName: string) => {
  return APP_ICONS[appName] || null
}

// Función para obtener el estilo de color de una app
const getAppStyle = (appName: string) => {
  return APP_STYLES[appName] || { bg: 'bg-[#666]', text: 'text-white' }
}

// Examples for quick testing
const EXAMPLES: Record<string, any> = {
  '+1 415 555 0182': {
    number: '+1 (415) 555-0182',
    country: 'United States',
    city: 'San Francisco, CA',
    region: 'California',
    riskScore: 22,
    riskGrade: 'BAJO',
    tags: ['green:Número válido', 'green:Sin reportes spam', 'blue:WhatsApp activo', 'teal:Móvil prepago'],
    carrier: { name: 'AT&T Mobility', type: 'Móvil postpago', network: 'GSM / LTE / 5G', mcc: '310', mnc: '410' },
    geo: { lat: '37.7749', lon: '-122.4194', timezone: 'America/Los_Angeles', confidence: '92%' },
    apps: [
      { name: 'WhatsApp', status: 'found', detail: 'Último visto: hace 2h' },
      { name: 'Telegram', status: 'found', detail: 'Cuenta activa' },
      { name: 'iMessage', status: 'found', detail: 'iPhone detectado' },
      { name: 'Signal', status: 'notfound', detail: 'No registrado' },
    ],
    spam: { overall: 'LIMPIO', scores: { spam: 8, robocall: 12, phishing: 3, fraud: 0, telemarketing: 22 } },
    identities: [
      { name: 'John Doe', detail: 'john.doe@gmail.com · GitHub', confidence: 88, cls: 'green' }
    ],
  },
  '+34 612 345 678': {
    number: '+34 612 345 678',
    country: 'España',
    city: 'Madrid',
    region: 'Comunidad de Madrid',
    riskScore: 58,
    riskGrade: 'MEDIO',
    tags: ['amber:Riesgo moderado', 'amber:7 reportes spam', 'blue:WhatsApp activo', 'orange:Telemarketing'],
    carrier: { name: 'Movistar España', type: 'Móvil postpago', network: 'GSM / LTE / 5G', mcc: '214', mnc: '07' },
    geo: { lat: '40.4168', lon: '-3.7038', timezone: 'Europe/Madrid', confidence: '85%' },
    apps: [
      { name: 'WhatsApp', status: 'found', detail: 'Último visto: ayer' },
      { name: 'Viber', status: 'found', detail: 'Cuenta activa' },
      { name: 'Facebook', status: 'found', detail: 'Cuenta vinculada' },
    ],
    spam: { overall: 'MODERADO', scores: { spam: 55, robocall: 40, phishing: 15, fraud: 8, telemarketing: 72 } },
    identities: [
      { name: 'Identidad parcial', detail: 'María G. · movistar.es', confidence: 54, cls: 'amber' },
      { name: 'Identidad alternativa', detail: 'MG Telemarketing SL', confidence: 31, cls: 'red' },
    ],
  },
  '+54 11 5555 0234': {
    number: '+54 11 5555-0234',
    country: 'Argentina',
    city: 'Buenos Aires',
    region: 'Ciudad Autónoma de Buenos Aires',
    riskScore: 31,
    riskGrade: 'BAJO',
    tags: ['green:Número válido', 'green:Sin spam significativo', 'blue:WhatsApp activo', 'teal:Móvil postpago'],
    carrier: { name: 'Claro Argentina', type: 'Móvil postpago', network: 'GSM / LTE', mcc: '722', mnc: '310' },
    geo: { lat: '-34.6037', lon: '-58.3816', timezone: 'America/Argentina/Buenos_Aires', confidence: '88%' },
    apps: [
      { name: 'WhatsApp', status: 'found', detail: 'Último visto: hace 1h' },
      { name: 'Telegram', status: 'found', detail: '@carlosdev_ar' },
      { name: 'Instagram', status: 'found', detail: '@carlos.dev.ar' },
      { name: 'LinkedIn', status: 'found', detail: 'carlos-dev' },
    ],
    spam: { overall: 'LIMPIO', scores: { spam: 12, robocall: 8, phishing: 0, fraud: 5, telemarketing: 31 } },
    identities: [
      { name: 'Carlos Méndez', detail: 'carlos.dev@gmail.com · LinkedIn', confidence: 77, cls: 'amber' }
    ],
  },
}

export default function PhonePage() {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [showExamples, setShowExamples] = useState(false)

  const loadExample = (key: string) => {
    setPhone(EXAMPLES[key].number)
    setShowExamples(false)
  }

  const analyzePhone = async () => {
    if (!phone) return
    
    setLoading(true)
    
    // Limpiar el número del input para comparar (solo dígitos)
    const cleanInput = phone.replace(/\D/g, '')
    console.log('Input limpio:', cleanInput)
    
    // Buscar en los ejemplos - buscar coincidencia en los últimos 8-10 dígitos
    let data: typeof EXAMPLES[keyof typeof EXAMPLES] | null = null
    for (const [key, val] of Object.entries(EXAMPLES)) {
      const cleanKey = key.replace(/\D/g, '')
      console.log('Comparando:', cleanInput, 'con', cleanKey)
      
      // Comprobar si el input contiene el número del ejemplo o viceversa
      // Usar los últimos 8 dígitos para mayor flexibilidad
      if (cleanInput.slice(-8) === cleanKey.slice(-8) || cleanKey.slice(-8) === cleanInput.slice(-8)) {
        data = val
        console.log('✓ Encontrado:', key)
        break
      }
    }
    
    // Si no encuentra coincidencia, usar datos por defecto
    if (!data) {
      console.log('No se encontró en mock, usando datos por defecto')
      data = {
        number: phone,
        country: 'Desconocido',
        city: '—',
        region: '—',
        riskScore: 0,
        riskGrade: '—',
        tags: ['green:Número válido'],
        carrier: { name: '—', type: '—', network: '—', mcc: '—', mnc: '—' },
        geo: { lat: '0', lon: '0', timezone: '—', confidence: '—' },
        apps: [],
        spam: { overall: 'LIMPIO', scores: { spam: 0, robocall: 0, phishing: 0, fraud: 0, telemarketing: 0 } },
        identities: [],
      }
    }
    
    setTimeout(() => {
      setResult(data)
      setLoading(false)
    }, 1500)
  }

  const getScoreColor = (score: number) => {
    if (score < 30) return 'var(--green)'
    if (score < 60) return 'var(--amber)'
    return 'var(--red)'
  }

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.04)] rounded-lg p-4 flex items-center gap-4">
        <div className="text-[#666] text-sm font-mono">Teléfono</div>
        <span className="text-[#666]">/</span>
        <span className="bg-[rgba(255,215,0,0.08)] text-[#ffd700] text-[9px] px-2 py-0.5 rounded border border-[rgba(255,215,0,0.3)] font-mono">Pro</span>
        <div className="flex-1 flex gap-3 items-center">
          <div className="flex items-center gap-2 bg-[#111] border border-[rgba(255,255,255,0.04)] rounded-md px-3 h-8">
            <Phone className="w-4 h-4 text-[#666]" />
            <span className="text-[#666]">+</span>
            <input
              type="tel"
              placeholder="1 415 555 0100 · 34 600 123 456"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && analyzePhone()}
              className="bg-transparent border-none text-[12px] font-mono text-white outline-none w-[280px]"
            />
          </div>
          <button 
            onClick={analyzePhone}
            disabled={loading || !phone}
            className="bg-[#00ff41] text-black h-8 px-4 rounded-md text-sm font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Analizando...' : 'Analizar'}
          </button>
          <button 
            onClick={() => setShowExamples(!showExamples)}
            className="h-8 px-3 bg-transparent border border-[rgba(255,255,255,0.08)] rounded-md text-[#999] text-xs font-mono hover:border-[#00ff41] hover:text-[#00ff41]"
          >
            Ejemplos
          </button>
        </div>
      </div>

      {/* Loading Bar */}
      <div className={`loading-bar ${loading ? 'active' : ''}`}>
        <div className="loading-fill"></div>
      </div>

      {/* Example Grid */}
      {showExamples && !result && !loading && (
        <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.04)] rounded-lg p-4">
          <div className="flex flex-wrap gap-2 justify-center max-w-[600px]">
            <button type="button" className="h-7 px-3 bg-[#0a0a0a] border border-[rgba(255,255,255,0.04)] rounded text-[#999] text-xs font-mono hover:border-[#00ff41] hover:text-[#00ff41]" onClick={() => loadExample('+1 415 555 0182')}>
              +1 415 555 0182
            </button>
            <button type="button" className="h-7 px-3 bg-[#0a0a0a] border border-[rgba(255,255,255,0.04)] rounded text-[#999] text-xs font-mono hover:border-[#00ff41] hover:text-[#00ff41]" onClick={() => loadExample('+34 612 345 678')}>
              +34 612 345 678
            </button>
            <button type="button" className="h-7 px-3 bg-[#0a0a0a] border border-[rgba(255,255,255,0.04)] rounded text-[#999] text-xs font-mono hover:border-[#00ff41] hover:text-[#00ff41]" onClick={() => loadExample('+54 11 5555 0234')}>
              +54 11 5555 0234
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2 max-w-[660px] mt-4">
            <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.04)] rounded-lg p-3 text-center">
              <div className="flex justify-center mb-1"><Shield className="w-5 h-5 text-[#00ff41]" /></div>
              <div className="text-[11px] font-semibold text-white">Operador</div>
              <div className="text-[10px] font-mono text-[#666]">Carrier, tipo, país</div>
            </div>
            <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.04)] rounded-lg p-3 text-center">
              <div className="flex justify-center mb-1"><MapPin className="w-5 h-5 text-[#00ff41]" /></div>
              <div className="text-[11px] font-semibold text-white">Geolocalización</div>
              <div className="text-[10px] font-mono text-[#666]">Ciudad, región, coords</div>
            </div>
            <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.04)] rounded-lg p-3 text-center">
              <div className="flex justify-center mb-1"><MessageCircle className="w-5 h-5 text-[#00ff41]" /></div>
              <div className="text-[11px] font-semibold text-white">Apps activas</div>
              <div className="text-[10px] font-mono text-[#666]">WhatsApp, Telegram…</div>
            </div>
            <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.04)] rounded-lg p-3 text-center">
              <div className="flex justify-center mb-1"><AlertTriangle className="w-5 h-5 text-[#00ff41]" /></div>
              <div className="text-[11px] font-semibold text-white">Spam / Fraude</div>
              <div className="text-[10px] font-mono text-[#666]">Reportes, score</div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!result && !loading && !showExamples && (
        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <div className="w-13 h-13 rounded-xl bg-[rgba(0,255,65,0.06)] border border-[rgba(0,255,65,0.3)] flex items-center justify-center">
            <Phone className="w-6 h-6 text-[#00ff41]" />
          </div>
          <div className="text-center">
            <div className="text-[15px] font-bold text-white">Módulo Teléfono · Pro</div>
            <div className="text-[12px] font-mono text-[#666] mt-1">
              Análisis de número: operador, geolocalización, apps, spam y identidad vinculada
            </div>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="flex flex-col gap-4">
          {/* Phone Header */}
          <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.04)] rounded-lg p-5">
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="w-11 h-11 rounded-lg bg-[rgba(0,255,65,0.06)] border border-[rgba(0,255,65,0.3)] flex items-center justify-center">
                <Phone className="w-5 h-5 text-[#00ff41]" />
              </div>
              <div className="flex-1">
                <div className="text-[20px] font-bold text-white font-mono">{result.number}</div>
                <div className="text-[11px] font-mono text-[#666] mt-1">{result.country} · {result.city} · {result.carrier?.type}</div>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {result.tags.map((tag: string, i: number) => {
                    const [color, text] = tag.split(':')
                    const colors: Record<string, string> = {
                      green: 'bg-[rgba(0,255,65,0.06)] text-[#00ff41] border-[rgba(0,255,65,0.3)]',
                      amber: 'bg-[rgba(255,215,0,0.08)] text-[#ffd700] border-[rgba(255,215,0,0.3)]',
                      blue: 'bg-[rgba(0,255,255,0.06)] text-[#00ffff] border-[rgba(0,255,255,0.3)]',
                      teal: 'bg-[rgba(0,255,255,0.06)] text-[#00ffff] border-[rgba(0,255,255,0.2)]',
                    }
                    return (
                      <span key={i} className={`text-[11px] font-mono px-2 py-1 rounded border ${colors[color] || colors.green}`}>
                        {text}
                      </span>
                    )
                  })}
                </div>
              </div>

              {/* Risk Gauge */}
              <div className="flex flex-col items-center">
                <div className="text-[9px] font-mono text-[#666] uppercase mb-1">Score de riesgo</div>
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 transform -rotate-[225deg]" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="28" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="6" />
                    <circle 
                      cx="40" cy="40" r="28" 
                      fill="none" 
                      stroke={getScoreColor(result.riskScore)} 
                      strokeWidth="6" 
                      strokeLinecap="round"
                      strokeDasharray="132"
                      strokeDashoffset={132 - (result.riskScore / 100 * 132)}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-[14px] font-bold text-white">{result.riskScore}</div>
                    <div className="text-[9px] font-mono text-[#666]">{result.riskGrade}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics strip */}
            <div className="flex border-t border-[rgba(255,255,255,0.04)]">
              {[
                { label: 'País', value: result.country },
                { label: 'Tipo', value: result.carrier?.type },
                { label: 'Operador', value: result.carrier?.name },
                { label: 'Spam score', value: `${result.riskScore} / 100`, color: getScoreColor(result.riskScore) },
                { label: 'Apps activas', value: `${result.apps?.filter((a: any) => a.status === 'found').length} detectadas` },
                { label: 'Identidades', value: `${result.identities?.length || 0} halladas` },
              ].map((m, i) => (
                <div key={i} className="flex-1 p-3 border-r border-[rgba(255,255,255,0.04)] last:border-r-0">
                  <div className="text-[9px] font-mono text-[#666] uppercase">{m.label}</div>
                  <div className="text-[13px] font-semibold" style={{ color: m.color || 'white' }}>{m.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Three Column Grid */}
          <div className="grid grid-cols-3 gap-4">
            {/* Column 1 */}
            <div className="flex flex-col gap-4">
              <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.04)] rounded-lg p-3">
                <div className="text-[11px] font-semibold text-[#666] mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Información del número
                </div>
                {[
                  { key: 'Número E.164', val: result.number.replace(/\D/g, '') },
                  { key: 'País', val: result.country },
                  { key: 'Tipo', val: result.carrier?.type },
                  { key: 'Prefijo nacional', val: result.city },
                  { key: 'Zona horaria', val: result.geo?.timezone },
                  { key: 'Validez', val: 'Número válido', cls: 'text-[#00ff41]' },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between py-2 border-b border-[rgba(255,255,255,0.04)] last:border-b-0">
                    <span className="text-[10px] font-mono text-[#666]">{row.key}</span>
                    <span className={`text-[11px] font-mono ${row.cls || 'text-[#ccc]'}`}>{row.val}</span>
                  </div>
                ))}
              </div>

              <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.04)] rounded-lg p-3">
                <div className="text-[11px] font-semibold text-[#666] mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Operador
                </div>
                <div className="bg-[#111] border border-[rgba(255,255,255,0.04)] rounded-md p-3 mb-2">
                  <div className="text-[12px] font-medium text-white">{result.carrier?.name}</div>
                  <div className="text-[10px] font-mono text-[#666]">{result.carrier?.type}</div>
                </div>
                {[
                  { key: 'Red', val: result.carrier?.network },
                  { key: 'MCC', val: result.carrier?.mcc },
                  { key: 'MNC', val: result.carrier?.mnc },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between py-2 border-b border-[rgba(255,255,255,0.04)] last:border-b-0">
                    <span className="text-[10px] font-mono text-[#666]">{row.key}</span>
                    <span className="text-[10px] font-mono text-[#ccc]">{row.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-4">
              <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.04)] rounded-lg p-3">
                <div className="text-[11px] font-semibold text-[#666] mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Geolocalización
                </div>
                <div className="h-40 bg-[#111] border border-[rgba(255,255,255,0.04)] rounded-lg flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-[rgba(0,255,65,0.06)] border-2 border-[#00ff41] flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-[#00ff41]" />
                    </div>
                    <div className="text-[11px] font-medium text-white mt-1">{result.city}</div>
                    <div className="text-[9px] font-mono text-[#666]">{result.geo?.lat}, {result.geo?.lon}</div>
                  </div>
                </div>
              </div>

              <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.04)] rounded-lg p-3">
                <div className="text-[11px] font-semibold text-[#666] mb-2 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" /> Aplicaciones detectadas
                </div>
                <div className="grid grid-cols-2">
                  {result.apps?.map((app: any, i: number) => {
                    const appStyle = getAppStyle(app.name)
                    const IconComponent = getAppIcon(app.name)
                    return (
                      <div key={i} className="flex items-center gap-2 py-2 border-b border-[rgba(255,255,255,0.04)] border-r border-[rgba(255,255,255,0.04)]">
                        <span className={`w-6 h-6 rounded flex items-center justify-center ${appStyle.bg} ${appStyle.text}`}>
                          {IconComponent && <IconComponent className="w-3.5 h-3.5" />}
                        </span>
                        <div className="flex-1">
                          <div className="text-[11px] font-medium text-white">{app.name}</div>
                          <div className="text-[9px] font-mono text-[#666]">{app.detail}</div>
                        </div>
                        <span className={`text-[9px] font-mono px-1 rounded ${app.status === 'found' ? 'bg-[rgba(0,255,65,0.06)] text-[#00ff41] border border-[rgba(0,255,65,0.3)]' : 'bg-[#111] text-[#666] border border-[rgba(255,255,255,0.04)]'}`}>
                          {app.status === 'found' ? 'ACTIVO' : 'NO'}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col gap-4">
              <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.04)] rounded-lg p-3">
                <div className="text-[11px] font-semibold text-[#666] mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Análisis de spam y fraude
                </div>
                <span className={`text-[10px] font-mono px-2 py-1 rounded border mb-3 inline-block ${
                  result.riskScore < 30 
                    ? 'bg-[rgba(0,255,65,0.06)] text-[#00ff41] border-[rgba(0,255,65,0.3)]'
                    : result.riskScore < 60
                    ? 'bg-[rgba(255,215,0,0.08)] text-[#ffd700] border-[rgba(255,215,0,0.3)]'
                    : 'bg-[rgba(255,51,51,0.08)] text-[#ff3333] border-[rgba(255,51,51,0.3)]'
                }`}>
                  {result.spam?.overall || 'LIMPIO'}
                </span>
                {Object.entries(result.spam?.scores || {}).map(([key, score]: [string, any], i) => (
                  <div key={i} className="py-2 border-b border-[rgba(255,255,255,0.04)] last:border-b-0">
                    <div className="text-[10px] font-mono text-[#666] mb-1">{key}</div>
                    <div className="h-1 bg-[rgba(255,255,255,0.04)] rounded overflow-hidden">
                      <div className="h-full rounded" style={{ width: `${score}%`, background: getScoreColor(score) }}></div>
                    </div>
                    <div className="text-[10px] font-mono text-[#ccc] mt-1">{score}</div>
                  </div>
                ))}
              </div>

              <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.04)] rounded-lg p-3">
                <div className="text-[11px] font-semibold text-[#666] mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" /> Identidades vinculadas
                </div>
                {result.identities?.length > 0 ? (
                  result.identities.map((id: any, i: number) => (
                    <div key={i} className="flex items-center gap-2 py-2 border-b border-[rgba(255,255,255,0.04)] last:border-b-0">
                      <div className="w-7 h-7 rounded-full bg-[#111] flex items-center justify-center">
                        <User className="w-4 h-4 text-[#666]" />
                      </div>
                      <div className="flex-1">
                        <div className="text-[11px] font-medium text-white">{id.name}</div>
                        <div className="text-[9px] font-mono text-[#666]">{id.detail}</div>
                      </div>
                      <span className={`text-[9px] font-mono px-1 rounded ${
                        id.cls === 'green' 
                          ? 'bg-[rgba(0,255,65,0.06)] text-[#00ff41] border border-[rgba(0,255,65,0.3)]'
                          : id.cls === 'amber'
                          ? 'bg-[rgba(255,215,0,0.08)] text-[#ffd700] border border-[rgba(255,215,0,0.3)]'
                          : 'bg-[rgba(255,51,51,0.08)] text-[#ff3333] border border-[rgba(255,51,51,0.3)]'
                      }`}>
                        {id.confidence}%
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="py-3 text-center text-[11px] text-[#666]">
                    No se encontraron identidades vinculadas
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}