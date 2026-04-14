'use client'

import { useState } from 'react'
import { Mail, Shield, AlertTriangle, Globe, Search, Check, X } from 'lucide-react'

// Examples for quick testing
const EXAMPLES = {
  'john.doe@gmail.com': 'john.doe@gmail.com',
  'admin@oldsite.com': 'admin@oldsite.com',
  'noreply@spambot.net': 'noreply@spambot.net',
}

// Mock data for examples
const MOCK_DATA: Record<string, any> = {
  'john.doe@gmail.com': {
    email: 'john.doe@gmail.com', valid: true, statusLevel: 'safe', statusLabel: 'Seguro',
    domain: 'gmail.com', domainInfo: 'Gmail · Verificado', status: '✓ Válido', risk: 'Bajo',
    breaches: 0, domainAge: '16 años', registrationDate: '1997-09-15',
    breachData: [],
    domainDetails: {
      registrar: 'Google Registry', registered: '1997-09-15', expires: '2025-09-14',
      mxPrimary: 'aspmx.l.google.com', spf: 'Configurado', dkim: 'Activo', dmarc: 'Activo'
    },
    validationChecks: [
      { label: 'Formato válido', valid: true },
      { label: 'Dominio existe', valid: true },
      { label: 'Servidor SMTP activo', valid: true },
      { label: 'MX records válidos', valid: true },
      { label: 'SPF configurado', valid: true },
      { label: 'No es temporal', valid: true },
    ],
    validationDetails: {
      'Sintaxis REGEX': '✓ Válida',
      'Disposición local': 'john.doe',
      'Dominio': 'gmail.com',
      'Servidor mail': 'aspmx.l.google.com',
      'Última verificación': 'Hace 2 minutos'
    }
  },
  'admin@oldsite.com': {
    email: 'admin@oldsite.com', valid: true, statusLevel: 'warn', statusLabel: 'Riesgo Moderado',
    domain: 'oldsite.com', domainInfo: 'Dominio antiguo · Riesgoso', status: '✓ Válido', risk: 'Moderado',
    breaches: 2, domainAge: '22 años', registrationDate: '2002-03-10',
    breachData: [
      { name: 'LinkedIn Breach 2021', date: '2021-04-09', records: 700000, icon: '⚠' },
      { name: 'Collection #1', date: '2019-01-07', records: 2200000, icon: '●' }
    ],
    domainDetails: {
      registrar: 'NameDrive Inc', registered: '2002-03-10', expires: '2025-03-10',
      mxPrimary: 'mx.oldsite.com', spf: 'No configurado', dkim: 'No activo', dmarc: 'No activo'
    },
    validationChecks: [
      { label: 'Formato válido', valid: true },
      { label: 'Dominio existe', valid: true },
      { label: 'Servidor SMTP activo', valid: true },
      { label: 'MX records válidos', valid: true },
      { label: 'SPF configurado', valid: false },
      { label: 'No es temporal', valid: true },
    ],
    validationDetails: {
      'Sintaxis REGEX': '✓ Válida',
      'Disposición local': 'admin',
      'Dominio': 'oldsite.com',
      'Servidor mail': 'mx.oldsite.com',
      'Última verificación': 'Hace 1 minuto'
    }
  },
  'noreply@spambot.net': {
    email: 'noreply@spambot.net', valid: false, statusLevel: 'danger', statusLabel: 'No Válido',
    domain: 'spambot.net', domainInfo: 'Dominio de spam · Inactivo', status: '✕ Inválido', risk: 'Alto',
    breaches: 5, domainAge: '8 años', registrationDate: '2016-07-22',
    breachData: [
      { name: 'SpamList Database', date: '2023-11-15', records: 5000000, icon: '●' },
      { name: 'Botnet Dump', date: '2022-08-30', records: 3200000, icon: '●' },
      { name: 'Phishing Kit Database', date: '2021-12-05', records: 1500000, icon: '⚠' }
    ],
    domainDetails: {
      registrar: 'Unknown Registrar', registered: '2016-07-22', expires: '2024-07-22',
      mxPrimary: 'mail.spambot.net', spf: 'No existe', dkim: 'No existe', dmarc: 'No existe'
    },
    validationChecks: [
      { label: 'Formato válido', valid: true },
      { label: 'Dominio existe', valid: false },
      { label: 'Servidor SMTP activo', valid: false },
      { label: 'MX records válidos', valid: false },
      { label: 'SPF configurado', valid: false },
      { label: 'No es temporal', valid: false },
    ],
    validationDetails: {
      'Sintaxis REGEX': '✓ Válida',
      'Disposición local': 'noreply',
      'Dominio': 'spambot.net',
      'Servidor mail': 'No responde',
      'Última verificación': 'Hace 30 segundos'
    }
  }
}

export default function EmailPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('validation')
  const [history, setHistory] = useState<Array<{email: string, breaches: number, status: string}>>([])

  const loadExample = (key: string) => {
    setEmail(EXAMPLES[key as keyof typeof EXAMPLES])
  }

  const verifyEmail = async () => {
    if (!email || !email.includes('@')) return
    
    setLoading(true)
    
    // Simulate API call with mock data
    setTimeout(() => {
      let data = MOCK_DATA[email] || generateBasicResult(email)
      
      setResult(data)
      setHistory(prev => [
        { email: email, breaches: data.breaches, status: data.statusLevel },
        ...prev.slice(0, 9)
      ])
      setLoading(false)
    }, 1500)
  }

  const generateBasicResult = (emailStr: string) => {
    const domain = emailStr.split('@')[1]
    return {
      email: emailStr, valid: true, statusLevel: 'info', statusLabel: 'Bajo riesgo',
      domain: domain, domainInfo: domain + ' · Verificando...', status: '✓ Válido', risk: 'Bajo',
      breaches: 0, domainAge: '—', registrationDate: '—',
      breachData: [],
      domainDetails: {
        registrar: '—', registered: '—', expires: '—',
        mxPrimary: '—', spf: '—', dkim: '—', dmarc: '—'
      },
      validationChecks: [
        { label: 'Formato válido', valid: true },
        { label: 'Dominio existe', valid: true },
        { label: 'Servidor SMTP activo', valid: false },
        { label: 'MX records válidos', valid: false },
        { label: 'SPF configurado', valid: false },
        { label: 'No es temporal', valid: true },
      ],
      validationDetails: {
        'Sintaxis REGEX': '✓ Válida',
        'Disposición local': emailStr.split('@')[0],
        'Dominio': domain,
        'Servidor mail': 'Verificando...',
        'Última verificación': 'Ahora'
      }
    }
  }

  const escapeHtml = (s: string) => {
    const div = document.createElement('div')
    div.textContent = s
    return div.innerHTML
  }

  const syntaxHighlight = (json: string) => {
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (m) => {
      let cls = 'num'
      if (/^"/.test(m)) cls = /:$/.test(m) ? 'key' : 'str'
      else if (/true|false/.test(m)) cls = 'bool'
      else if (/null/.test(m)) cls = 'null'
      return `<span class="${cls}">${m}</span>`
    })
  }

  const renderKV = (data: Record<string, string>) => {
    return Object.entries(data)
      .map(([k, v]) => `<tr><td>${escapeHtml(k)}</td><td>${escapeHtml(String(v))}</td></tr>`)
      .join('')
  }

  const spfColor = (val: string) => {
    if (!val || val === '—') return 'var(--text4)'
    if (val === 'Configurado' || val === 'Activo') return 'var(--green)'
    return 'var(--red)'
  }

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.04)] rounded-lg p-4 flex items-center gap-4">
        <div className="text-[#666] text-sm font-mono">Email Intelligence</div>
        <span className="text-[#666]">/</span>
        <div className="flex-1 flex gap-3">
          <input
            type="text"
            placeholder="usuario@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && verifyEmail()}
            className="flex-1 max-w-md bg-[#111] border border-[rgba(255,255,255,0.08)] rounded-lg px-4 py-2 text-white placeholder-[#666] font-mono text-sm focus:border-[#00ffff] focus:outline-none"
          />
          <button 
            onClick={() => verifyEmail()}
            disabled={loading || !email}
            style={{ 
              height: '32px', 
              padding: '0 16px', 
              background: 'var(--blue)', 
              border: 'none', 
              borderRadius: '6px',
              color: '#fff', 
              fontSize: '12px', 
              fontWeight: 600,
              cursor: 'pointer',
              opacity: loading || !email ? 0.4 : 1
            }}
          >
            {loading ? 'Verificando...' : 'VERIFICAR'}
          </button>
          <button 
            onClick={() => loadExample('john.doe@gmail.com')}
            className="btn-example"
          >
            Gmail
          </button>
          <button 
            onClick={() => loadExample('admin@oldsite.com')}
            className="btn-example"
          >
            Riesgoso
          </button>
        </div>
      </div>

      {/* Loading Bar */}
      <div className={`loading-bar ${loading ? 'active' : ''}`} style={{ background: 'var(--blue)' }}>
        <div className="loading-fill" style={{ background: 'var(--blue)' }}></div>
      </div>

      {/* Empty State */}
      {!result && !loading && (
        <div className="empty-state">
          <div className="empty-label">// ingresá un email para comenzar la verificación</div>
          <div className="empty-grid">
            <div className="empty-card" onClick={() => loadExample('john.doe@gmail.com')}>
              <div className="empty-card-title" style={{ color: 'var(--green)' }}>✓ Válido</div>
              <div className="empty-card-sub">john.doe@gmail.com</div>
            </div>
            <div className="empty-card" onClick={() => loadExample('admin@oldsite.com')}>
              <div className="empty-card-title" style={{ color: 'var(--amber)' }}>⚠ Riesgoso</div>
              <div className="empty-card-sub">admin@oldsite.com</div>
            </div>
            <div className="empty-card" onClick={() => loadExample('noreply@spambot.net')}>
              <div className="empty-card-title" style={{ color: 'var(--red)' }}>✕ Inválido</div>
              <div className="empty-card-sub">noreply@spambot.net</div>
            </div>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="result visible">
          {/* Email Header */}
          <div className="email-header">
            <div className="email-icon">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="email-title">{result.email}</div>
              <div className="email-sub">{result.domainInfo}</div>
            </div>
            <div className="email-badges">
              <span className={`status-badge ${result.statusLevel}`}>
                <span className="s-dot"></span>
                {result.statusLabel}
              </span>
            </div>
          </div>

          {/* Metrics */}
          <div className="metrics-row">
            <div className="metric-card">
              <div className="metric-label">Estado</div>
              <div className="metric-value" style={{ color: 'var(--blue)' }}>{result.status}</div>
              <div className="metric-note">Sintaxis</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Riesgo</div>
              <div className="metric-value" style={{ color: result.breaches === 0 ? 'var(--green)' : result.breaches <= 2 ? 'var(--amber)' : 'var(--red)' }}>
                {result.risk}
              </div>
              <div className="metric-note">Nivel</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Brechas detectadas</div>
              <div className="metric-value" style={{ color: result.breaches > 0 ? 'var(--red)' : 'var(--blue)' }}>
                {result.breaches}
              </div>
              <div className="metric-note">Bases comprometidas</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Edad del dominio</div>
              <div className="metric-value" style={{ color: 'var(--blue)' }}>{result.domainAge}</div>
              <div className="metric-note">Antigüedad</div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: '8px', padding: '12px', marginTop: '12px' }}>
            <div className="tab-nav">
              <button className={`tab ${activeTab === 'validation' ? 'active' : ''}`} onClick={() => setActiveTab('validation')}>VALIDACIÓN</button>
              <button className={`tab ${activeTab === 'breaches' ? 'active' : ''}`} onClick={() => setActiveTab('breaches')}>BRECHAS</button>
              <button className={`tab ${activeTab === 'domain' ? 'active' : ''}`} onClick={() => setActiveTab('domain')}>DOMINIO</button>
              <button className={`tab ${activeTab === 'raw' ? 'active' : ''}`} onClick={() => setActiveTab('raw')}>JSON</button>
            </div>

            {/* Validation Tab */}
            <div className={`tab-content ${activeTab === 'validation' ? 'active' : ''}`}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', padding: '12px', background: 'var(--bg2)', borderRadius: '6px', marginBottom: '12px' }}>
                {result.validationChecks?.map((c: any, i: number) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
                    <div style={{ 
                      width: '16px', height: '16px', borderRadius: '50%', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '10px', fontWeight: 600,
                      background: c.valid ? 'var(--green-bg)' : 'var(--red-bg)',
                      color: c.valid ? 'var(--green)' : 'var(--red)'
                    }}>
                      {c.valid ? '✓' : '✕'}
                    </div>
                    <span>{c.label}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: 'var(--bg3)', padding: '12px', borderRadius: '6px', marginTop: '12px' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text3)', marginBottom: '8px' }}>RESUMEN DE VALIDACIÓN</div>
                <table className="results-table" dangerouslySetInnerHTML={{ __html: renderKV(result.validationDetails) }} />
              </div>
            </div>

            {/* Breaches Tab */}
            <div className={`tab-content ${activeTab === 'breaches' ? 'active' : ''}`}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text3)', marginBottom: '12px' }}>HISTORIAL DE BRECHAS</div>
              {result.breachData && result.breachData.length > 0 ? (
                result.breachData.map((b: any, i: number) => (
                  <div key={i} className="breach-item">
                    <div className="breach-icon" style={{ background: 'var(--red-bg)' }}>{b.icon}</div>
                    <div className="breach-info">
                      <div className="breach-name">{b.name}</div>
                      <div className="breach-meta">{b.date} · {b.records.toLocaleString()} registros</div>
                    </div>
                    <div className="breach-count">⚠</div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--green)' }}>
                  <div style={{ fontSize: '16px', marginBottom: '8px' }}>✓</div>
                  <div style={{ fontSize: '12px' }}>Email no encontrado en bases de datos comprometidas</div>
                  <div style={{ fontSize: '10px', color: 'var(--text4)', marginTop: '4px' }}>Escaneo realizado en 847 fuentes públicas</div>
                </div>
              )}
            </div>

            {/* Domain Tab */}
            <div className={`tab-content ${activeTab === 'domain' ? 'active' : ''}`}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text3)', marginBottom: '6px' }}>INFORMACIÓN DE DOMINIO</div>
                  <table className="results-table" dangerouslySetInnerHTML={{ __html: renderKV({
                    'Dominio': result.domain,
                    'Registrador': result.domainDetails?.registrar || '—',
                    'Registrado': result.domainDetails?.registered || '—',
                    'Expira': result.domainDetails?.expires || '—',
                    'Estado': result.domainDetails?.expires !== '—' ? '✓ Activo' : '—',
                  }) }} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text3)', marginBottom: '6px' }}>REGISTROS TÉCNICOS</div>
                  <table className="results-table" dangerouslySetInnerHTML={{ __html: renderKV({
                    'MX Primario': result.domainDetails?.mxPrimary || '—',
                    'SPF': result.domainDetails?.spf || '—',
                    'DKIM': result.domainDetails?.dkim || '—',
                    'DMARC': result.domainDetails?.dmarc || '—',
                    'IP Address': '—',
                  }) }} />
                </div>
              </div>
            </div>

            {/* Raw JSON Tab */}
            <div className={`tab-content ${activeTab === 'raw' ? 'active' : ''}`}>
              <div className="raw-wrap" dangerouslySetInnerHTML={{ __html: syntaxHighlight(JSON.stringify({
                email: result.email, valid: result.valid, risk: result.risk, breaches: result.breaches,
                domain: result.domain, domainAge: result.domainAge,
                validation: result.validationDetails,
              }, null, 2)) }} />
            </div>
          </div>

          {/* Status message */}
          <div className="status-msg">Verificación completada</div>
        </div>
      )}
    </div>
  )
}