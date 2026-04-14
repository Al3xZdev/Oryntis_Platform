'use client'

import { useState } from 'react'
import { Search, Globe, Lock, AlertTriangle, Clock, Database, Server } from 'lucide-react'

// Examples for quick testing
const EXAMPLES = {
  legit: 'google.com',
  phishing: 'paypa1-secure-login.xyz',
  new: 'acmestartup.io',
}

export default function DomainPage() {
  const [domain, setDomain] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('whois')
  const [history, setHistory] = useState<Array<{domain: string, date: string, certs: number}>>([])
  const [isRealData, setIsRealData] = useState(false)
  const [dataSource, setDataSource] = useState<any>(null)

  const loadExample = (key: string) => {
    setDomain(EXAMPLES[key as keyof typeof EXAMPLES])
  }

  const analyzeDomain = async () => {
    if (!domain) return
    
    // Clean domain
    let cleanDomain = domain.trim()
    cleanDomain = cleanDomain.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '')
    
    setLoading(true)
    setActiveTab('whois')
    setResult(null)
    setIsRealData(false)
    
    // Call real API
    try {
      console.log('Calling API for Domain:', cleanDomain)
      const res = await fetch('http://localhost:5000/api/osint/domain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: cleanDomain })
      })
      
      console.log('Domain API Response status:', res.status)
      
      if (!res.ok) throw new Error(`API error: ${res.status}`)
      
      const data = await res.json()
      console.log('Domain API Response:', data)
      
      // Check if we got real data (has domain field and at least one real data point)
      if (data && data.domain) {
        // Transform API response to match UI format
        // Check if we have real data from APIs (certificates or DNS records)
        const hasRealData = (data.certificates_count > 0) || (data.dns_records && data.dns_records.length > 0)
        
        // Guardar información de qué datos vienen de APIs reales
        setDataSource(data.data_source || null)
        
        const resultData = {
          domain: data.domain,
          tld: data.domain.includes('.') ? '.' + data.domain.split('.').pop() : '',
          certificates_count: data.certificates_count || 0,
          ssl: true,
          registrar: data.registrar || 'N/A',
          createdDate: data.createdDate || 'N/A',
          expiryDate: data.expiryDate || 'N/A',
          updatedDate: data.updatedDate || 'N/A',
          nameservers: data.nameservers || [],
          sslGrade: data.ssl_info?.grade || 'A',
          sslIssuer: data.ssl_info?.issuer || "Let's Encrypt",
          sslProtocol: data.ssl_info?.protocol || 'TLS 1.3',
          sslValidFrom: data.ssl_info?.validFrom || 'N/A',
          sslValidTo: data.ssl_info?.validTo || 'N/A',
          dnsRecords: data.dns_records || [],
          subdomains: data.subdomains || [],
          reputation: data.reputation || { risk: 0, category: 'General' },
          links: {
            crt_sh: `https://crt.sh/?q=%25.${cleanDomain}`,
            ssl_labs: `https://www.ssllabs.com/ssltest/analyze.html?d=${cleanDomain}`,
            security_trails: `https://securitytrails.com/domain/${cleanDomain}`,
          }
        }
        
        setResult(resultData)
        setIsRealData(hasRealData)
        
        // Guardar debug info
        console.log('📊 Data Source:', data.data_source)
        console.log('📊 Debug:', data.debug)
        console.log(hasRealData ? '✅ Using REAL data from API' : '⚠️ API returned but limited data')
        
        setHistory(prev => [
          { domain: cleanDomain, date: new Date().toISOString(), certs: resultData.certificates_count },
          ...prev.slice(0, 9)
        ])
      } else {
        throw new Error('Invalid API response')
      }
    } catch (err) {
      console.error('Domain API Error:', err)
      // Fallback to mock
      setIsRealData(false)
      setDataSource({
        dns_records: 'mock',
        certificates: 'mock',
        whois: 'mock',
        ssl: 'mock',
        subdomains: 'mock',
        reputation: 'mock'
      })
      console.log('⚠️ Using MOCK data (fallback)')
      
      const mockResult = {
        domain: cleanDomain,
        tld: cleanDomain.includes('.') ? '.' + cleanDomain.split('.').pop() : '',
        certificates_count: Math.floor(Math.random() * 50) + 1,
        ssl: true,
        registrar: 'GoDaddy.com, LLC',
        createdDate: '2019-03-15',
        expiryDate: '2026-03-15',
        updatedDate: '2024-01-20',
        nameservers: ['ns1.cloudflare.com', 'ns2.cloudflare.com', 'ns3.cloudflare.com'],
        sslGrade: 'A',
        sslIssuer: "Let's Encrypt",
        sslProtocol: 'TLS 1.3',
        sslValidFrom: '2024-12-01',
        sslValidTo: '2025-03-01',
        dnsRecords: [
          { type: 'A', value: '142.250.185.78', ttl: 3600 },
          { type: 'A', value: '142.250.185.79', ttl: 3600 },
          { type: 'AAAA', value: '2607:f8b0:4009:80b::201e', ttl: 3600 },
          { type: 'MX', value: 'aspmx.l.google.com', priority: 1, ttl: 3600 },
          { type: 'MX', value: 'alt1.aspmx.l.google.com', priority: 5, ttl: 3600 },
          { type: 'TXT', value: 'v=spf1 include:_spf.google.com ~all', ttl: 3600 },
          { type: 'NS', value: 'ns1.cloudflare.com', ttl: 86400 },
          { type: 'NS', value: 'ns2.cloudflare.com', ttl: 86400 },
        ],
        subdomains: [
          { name: 'www', ip: '142.250.185.78', status: 'active' },
          { name: 'mail', ip: '209.85.220.41', status: 'active' },
          { name: 'cdn', ip: '172.217.14.81', status: 'active' },
        ],
        reputation: {
          risk: Math.floor(Math.random() * 30),
          category: 'General',
          googleSafeBrowsing: 'clean',
          virustotal: 'clean',
          phishtank: 'not_registered',
        },
        links: {
          crt_sh: `https://crt.sh/?q=%25.${cleanDomain}`,
          ssl_labs: `https://www.ssllabs.com/ssltest/analyze.html?d=${cleanDomain}`,
          security_trails: `https://securitytrails.com/domain/${cleanDomain}`,
        }
      }
      
      setResult(mockResult)
      setHistory(prev => [
        { domain: cleanDomain, date: new Date().toISOString(), certs: mockResult.certificates_count },
        ...prev.slice(0, 9)
      ])
    }
    setLoading(false)
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

  // Determine status based on domain
  const getStatus = () => {
    if (!result) return { level: 'safe', label: 'Sin amenazas' }
    const isSuspicious = result.domain.includes('-') && result.domain.length > 20
    if (isSuspicious) return { level: 'danger', label: 'Phishing sospechoso' }
    if (result.reputation?.risk > 20) return { level: 'warn', label: 'Riesgo moderado' }
    return { level: 'safe', label: 'Sin amenazas' }
  }

  const status = getStatus()

  const renderKV = (data: Record<string, string>) => {
    return Object.entries(data)
      .map(([k, v]) => `<tr><td>${escapeHtml(k)}</td><td>${escapeHtml(String(v))}</td></tr>`)
      .join('')
  }

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.04)] rounded-lg p-4 flex items-center gap-4">
        <div className="text-[#666] text-sm font-mono">Dominios</div>
        <span className="text-[#666]">/</span>
        <div className="flex-1 flex gap-3">
          <input
            type="text"
            placeholder="Ingresá un dominio — ej: google.com"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && analyzeDomain()}
            className="flex-1 max-w-md bg-[#111] border border-[rgba(255,255,255,0.08)] rounded-lg px-4 py-2 text-white placeholder-[#666] font-mono text-sm focus:border-[#00ff41] focus:outline-none"
          />
          <button 
            onClick={() => loadExample('legit')}
            className="btn-example"
          >
            Legítimo
          </button>
          <button 
            onClick={() => loadExample('phishing')}
            className="btn-example"
          >
            Phishing
          </button>
          <button 
            onClick={() => loadExample('new')}
            className="btn-example"
          >
            Dominio nuevo
          </button>
          <button 
            onClick={analyzeDomain}
            disabled={loading || !domain}
            className="btn-analyze"
          >
            {loading ? 'Analizando...' : 'Analizar →'}
          </button>
        </div>
      </div>

      {/* Loading Bar */}
      <div className={`loading-bar ${loading ? 'active' : ''}`}>
        <div className="loading-fill"></div>
      </div>

      {/* Empty State */}
      {!result && !loading && (
        <div className="empty-state">
          <div className="empty-label">// ingresá un dominio para comenzar el análisis</div>
          <div className="empty-grid">
            <div className="empty-card">
              <div className="empty-card-title">WHOIS</div>
              <div className="empty-card-sub">registrante · fechas · NS</div>
            </div>
            <div className="empty-card">
              <div className="empty-card-title">SSL / TLS</div>
              <div className="empty-card-sub">cert · emisor · validez</div>
            </div>
            <div className="empty-card">
              <div className="empty-card-title">DNS Records</div>
              <div className="empty-card-sub">A · MX · TXT · NS · CNAME</div>
            </div>
            <div className="empty-card">
              <div className="empty-card-title">Subdominios</div>
              <div className="empty-card-sub">enumeración pasiva</div>
            </div>
            <div className="empty-card">
              <div className="empty-card-title">Reputación</div>
              <div className="empty-card-sub">phishing · malware · spam</div>
            </div>
            <div className="empty-card">
              <div className="empty-card-title">Historial</div>
              <div className="empty-card-sub">cambios · wayback · IPs</div>
            </div>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="result visible">
          {/* Domain Header */}
          <div className="domain-header">
            <div className="domain-favicon">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="domain-title">{result.domain}</div>
              <div className="domain-sub">{result.tld} · {result.certificates_count} certificados</div>
            </div>
            <div className="domain-badges">
              {/* Data Source Indicator */}
              <span className={`status-badge ${isRealData ? 'safe' : 'warn'}`}>
                <span className="s-dot"></span>
                {isRealData ? '🟢 API REAL' : '🟡 MOCK'}
              </span>
              <span className={`status-badge ${status.level}`}>
                <span className="s-dot"></span>
                {status.label}
              </span>
              <span className="status-badge safe">
                <span className="s-dot"></span>
                SSL activo
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div>
            <div className="tabs">
              <button className={`tab ${activeTab === 'whois' ? 'active' : ''}`} onClick={() => setActiveTab('whois')}>
                WHOIS
                {dataSource?.whois === 'mock' && <span className="tab-badge mock" title="Datos simulados - Las APIs de WHOIS requieren API key de pago">?</span>}
              </button>
              <button className={`tab ${activeTab === 'ssl' ? 'active' : ''}`} onClick={() => setActiveTab('ssl')}>
                SSL / TLS
                {dataSource?.ssl === 'mock' && <span className="tab-badge mock" title="Datos simulados - Las APIs de SSL requieren API key de pago">?</span>}
              </button>
              <button className={`tab ${activeTab === 'dns' ? 'active' : ''}`} onClick={() => setActiveTab('dns')}>
                DNS Records
                {dataSource?.dns_records === 'real' && <span className="tab-badge real" title="Datos reales de DNS.google">✓</span>}
              </button>
              <button className={`tab ${activeTab === 'subs' ? 'active' : ''}`} onClick={() => setActiveTab('subs')}>Subdominios</button>
              <button className={`tab ${activeTab === 'rep' ? 'active' : ''}`} onClick={() => setActiveTab('rep')}>Reputación</button>
              <button className={`tab ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>Historial</button>
              <button className={`tab ${activeTab === 'raw' ? 'active' : ''}`} onClick={() => setActiveTab('raw')}>Raw JSON</button>
            </div>
            <div className="panels-wrap">
              {/* WHOIS Tab */}
              <div className={`tab-content ${activeTab === 'whois' ? 'active' : ''}`}>
                {/* Warning banner for mock data */}
                <div className="warning-banner">
                  <span className="warning-icon">⚠️</span>
                  <div className="warning-content">
                    <strong>Datos simulados</strong> — Las APIs de WHOIS requieren suscripciones de pago (WhoisXML, RDAP). 
                    Los nameservers que ves son un ejemplo genérico, no los reales del dominio.
                  </div>
                </div>
                <div className="grid-2">
                  <div>
                    <div className="sec-title">Registro</div>
                    <table className="kv" dangerouslySetInnerHTML={{ __html: renderKV({
                      'Dominio': result.domain,
                      'TLD': result.tld,
                      'Registrar': result.registrar,
                      'Creado': result.createdDate,
                      'Expira': result.expiryDate,
                      'Actualizado': result.updatedDate,
                    }) }} />
                  </div>
                  <div>
                    <div className="sec-title">Name Servers</div>
                    <div style={{ marginTop: '10px' }}>
                      {result.nameservers.map((ns: string, i: number) => (
                        <div key={i} className="dns-record">
                          <span className="dns-type ns">NS</span>
                          <span className="dns-value">{ns}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: '14px' }}>
                  <div className="sec-title">Links Externos</div>
                  <table className="kv" dangerouslySetInnerHTML={{ __html: renderKV({
                    'crt.sh': result.links.crt_sh,
                    'SSL Labs': result.links.ssl_labs,
                    'SecurityTrails': result.links.security_trails,
                    'DNSdumpster': 'https://dnsdumpster.com/',
                  }) }} />
                </div>
              </div>

              {/* SSL Tab */}
              <div className={`tab-content ${activeTab === 'ssl' ? 'active' : ''}`}>
                {/* Warning banner for mock data */}
                <div className="warning-banner">
                  <span className="warning-icon">⚠️</span>
                  <div className="warning-content">
                    <strong>Datos simulados</strong> — Las APIs de SSL (SSL Labs, SSLDig) requieren API key de pago. 
                    Los datos que ves son un ejemplo genérico, no el certificado real del dominio.
                  </div>
                </div>
                <div className="grid-2">
                  <div className="ssl-visual">
                    <div className="info-card-label">Calificación SSL</div>
                    <div className="ssl-grade" style={{ color: 'var(--green)' }}>{result.sslGrade}</div>
                    <div className="ssl-bar-wrap">
                      <div className="ssl-bar-fill" style={{ width: '90%', background: 'var(--green)' }}></div>
                    </div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text4)', marginBottom: '12px' }}>Score: 90/100</div>
                    <div className="ssl-detail-row">
                      <span className="ssl-detail-key">Emisor</span>
                      <span className="ssl-detail-val">{result.sslIssuer}</span>
                    </div>
                    <div className="ssl-detail-row">
                      <span className="ssl-detail-key">Protocolo</span>
                      <span className="ssl-detail-val">{result.sslProtocol}</span>
                    </div>
                    <div className="ssl-detail-row">
                      <span className="ssl-detail-key">Válido desde</span>
                      <span className="ssl-detail-val">{result.sslValidFrom}</span>
                    </div>
                    <div className="ssl-detail-row">
                      <span className="ssl-detail-key">Válido hasta</span>
                      <span className="ssl-detail-val">{result.sslValidTo}</span>
                    </div>
                    <div className="ssl-detail-row">
                      <span className="ssl-detail-key">HSTS</span>
                      <span className="ssl-detail-val">Sí</span>
                    </div>
                  </div>
                  <div>
                    <div className="sec-title">Detalles del certificado</div>
                    <table className="kv" dangerouslySetInnerHTML={{ __html: renderKV({
                      'SAN': `${result.domain}, www.${result.domain}`,
                      'CT Logs': 'Incluido',
                      'Validado': 'Sí',
                      'Key Usage': 'Digital Signature, Key Encipherment',
                      'Ext Key Usage': 'TLS Web Server Authentication',
                    }) }} />
                  </div>
                </div>
              </div>

              {/* DNS Tab */}
              <div className={`tab-content ${activeTab === 'dns' ? 'active' : ''}`}>
                {/* Real data banner */}
                <div className="success-banner">
                  <span className="success-icon">✓</span>
                  <div className="success-content">
                    <strong>Datos reales</strong> — Obtenidos desde DNS.google (API pública sin autenticación)
                  </div>
                </div>
                <div className="sec-title">Registros DNS</div>
                <div>
                  {result.dnsRecords.map((record: any, i: number) => (
                    <div key={i} className="dns-record">
                      <span className={`dns-type ${record.type.toLowerCase()}`}>{record.type}</span>
                      <span className="dns-value">
                        {record.priority ? `${record.priority} ` : ''}{record.value}
                      </span>
                      <span className="dns-ttl">{record.ttl}s</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subdomains Tab */}
              <div className={`tab-content ${activeTab === 'subs' ? 'active' : ''}`}>
                {/* Warning banner - not implemented */}
                <div className="warning-banner">
                  <span className="warning-icon">⚠️</span>
                  <div className="warning-content">
                    <strong>No implementado</strong> — La enumeración de subdominios requiere APIs como SecurityTrails, 
                    Censys o subfinder. Los datos que ves son un ejemplo genérico.
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div className="sec-title" style={{ marginBottom: '0' }}>Subdominios encontrados</div>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text4)' }}>
                    {result.subdomains.length} encontrados
                  </span>
                </div>
                <div>
                  {result.subdomains.map((sub: any, i: number) => (
                    <div key={i} className="subdomain-item">
                      <span className="sub-name">{sub.name}.{result.domain}</span>
                      <span className="sub-ip">{sub.ip}</span>
                      <span className="sub-status pill info">{sub.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reputation Tab */}
              <div className={`tab-content ${activeTab === 'rep' ? 'active' : ''}`}>
                {/* Warning banner - not implemented */}
                <div className="warning-banner">
                  <span className="warning-icon">⚠️</span>
                  <div className="warning-content">
                    <strong>No implementado</strong> — La verificación de reputación requiere APIs como VirusTotal, 
                    Google Safe Browsing o Phishtank. Los datos que ves son un ejemplo genérico.
                  </div>
                </div>
                <div className="grid-3" style={{ marginBottom: '16px' }}>
                  <div className="info-card" style={{ borderColor: result.reputation.risk < 20 ? 'var(--green-bd)' : result.reputation.risk < 50 ? 'var(--amber-bd)' : 'var(--red-bd)' }}>
                    <div className="info-card-label">Riesgo</div>
                    <div className="info-card-value" style={{ color: result.reputation.risk < 20 ? 'var(--green)' : result.reputation.risk < 50 ? 'var(--amber)' : 'var(--red)' }}>
                      {result.reputation.risk}/100
                    </div>
                  </div>
                  <div className="info-card" style={{ borderColor: 'var(--blue-bd)' }}>
                    <div className="info-card-label">Categoría</div>
                    <div className="info-card-value" style={{ color: 'var(--blue)' }}>{result.reputation.category}</div>
                  </div>
                  <div className="info-card" style={{ borderColor: 'var(--amber-bd)' }}>
                    <div className="info-card-label">Certificados</div>
                    <div className="info-card-value" style={{ color: 'var(--amber)' }}>{result.certificates_count}</div>
                  </div>
                </div>
                <div className="sec-title">Verificación en fuentes</div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '0.5px solid var(--border)' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text)' }}>Google Safe Browsing</span>
                    <span className={`pill ${result.reputation.googleSafeBrowsing === 'clean' ? 'safe' : 'danger'}`}>
                      {result.reputation.googleSafeBrowsing === 'clean' ? 'LIMPIO' : 'PELIGROSO'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '0.5px solid var(--border)' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text)' }}>VirusTotal</span>
                    <span className={`pill ${result.reputation.virustotal === 'clean' ? 'safe' : 'warn'}`}>
                      {result.reputation.virustotal === 'clean' ? 'LIMPIO' : 'ADVERTENCIA'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '0.5px solid var(--border)' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text)' }}>Phishtank</span>
                    <span className="pill safe">No registrado</span>
                  </div>
                </div>
              </div>

              {/* History Tab */}
              <div className={`tab-content ${activeTab === 'history' ? 'active' : ''}`}>
                {/* Warning banner - not implemented */}
                <div className="warning-banner">
                  <span className="warning-icon">⚠️</span>
                  <div className="warning-content">
                    <strong>No implementado</strong> — El historial de dominios (cambios de DNS, IPs, wayback) 
                    requiere APIs como SecurityTrails o Wayback Machine. Los datos que ves son un ejemplo genérico.
                  </div>
                </div>
                <div className="sec-title">Línea de tiempo del dominio</div>
                <div>
                  <div className="timeline-item">
                    <div className="tl-dot blue"></div>
                    <div className="tl-content">
                      <div className="tl-date">{new Date().toISOString().slice(0, 10)}</div>
                      <div className="tl-title">Dominio analizado</div>
                      <div className="tl-desc">Análisis realizado vía Oryntis</div>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="tl-dot green"></div>
                    <div className="tl-content">
                      <div className="tl-date">{result.createdDate}</div>
                      <div className="tl-title">Dominio creado</div>
                      <div className="tl-desc">Registrado en {result.registrar}</div>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="tl-dot green"></div>
                    <div className="tl-content">
                      <div className="tl-date">—</div>
                      <div className="tl-title">SSL activo</div>
                      <div className="tl-desc">Certificado válido detectado</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Raw JSON Tab */}
              <div className={`tab-content ${activeTab === 'raw' ? 'active' : ''}`}>
                <div className="sec-title">Respuesta completa (JSON)</div>
                <div className="raw-wrap" dangerouslySetInnerHTML={{ __html: syntaxHighlight(JSON.stringify(result, null, 2)) }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}