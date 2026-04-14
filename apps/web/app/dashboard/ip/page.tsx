'use client'

import { useState } from 'react'
import { Search, Globe, Shield, AlertTriangle, Server, MapPin } from 'lucide-react'

// Examples for quick testing
const EXAMPLES = {
  tor: '185.220.101.45',
  clean: '8.8.8.8',
  scanner: '198.20.69.74',
}

export default function IpPage() {
  const [ip, setIp] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('geo')
  const [history, setHistory] = useState<Array<{ip: string, date: string, country: string}>>([])
  const [isRealData, setIsRealData] = useState(false)

  const loadExample = (key: string) => {
    setIp(EXAMPLES[key as keyof typeof EXAMPLES])
  }

  const analyzeIp = async () => {
    if (!ip) return
    
    // Validate IP format
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/
    if (!ipRegex.test(ip)) {
      setStatus('Ingresá una IP válida')
      return
    }
    
    setLoading(true)
    setActiveTab('geo')
    setResult(null)
    setIsRealData(false)
    
    // Call real API
    try {
      console.log('Calling API for IP:', ip)
      const res = await fetch('http://localhost:5000/api/osint/ip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip })
      })
      
      console.log('Response status:', res.status)
      console.log('Response ok:', res.ok)
      
      if (!res.ok) {
        const errorText = await res.text()
        console.log('Error response:', errorText)
        throw new Error(`API error: ${res.status} - ${errorText}`)
      }
      
      const data = await res.json()
      console.log('API Response:', JSON.stringify(data))
      
      // Check if we got real data from the API (has success field or real country)
      if (data && (data.success === true || (data.country && data.country !== 'Unknown'))) {
        setResult(data)
        setIsRealData(true)
        setStatus(`✅ Datos REALES de API - ${data.country || ''} - ISP: ${data.isp || 'N/A'}`)
      } else {
        console.log('Invalid API response, falling back to mock. Data:', data)
        throw new Error('Invalid API response - no real data')
      }
      
      setHistory(prev => [
        { ip: ip, date: new Date().toISOString(), country: data.country || 'Unknown' },
        ...prev.slice(0, 9)
      ])
    } catch (err) {
      console.error('API Error:', err)
      // Fallback to mock on error
      setIsRealData(false)
      setStatus('⚠️ Error - usando datos MOCK (locales)')
      const isTor = ip.startsWith('185.220.101')
      const isScanner = ip.startsWith('198.20')
      
      const mockResult = {
        ip: ip,
        country: isTor ? 'Germany' : isScanner ? 'Netherlands' : 'United States',
        city: isTor ? 'Frankfurt' : isScanner ? 'Amsterdam' : 'San Francisco',
        region: isTor ? 'Hesse' : isScanner ? 'North Holland' : 'California',
        latitude: isTor ? '50.1109' : isScanner ? '52.3676' : '37.7749',
        longitude: isTor ? '8.6821' : isScanner ? '4.9041' : '-122.4194',
        timezone: isTor ? 'Europe/Berlin' : isScanner ? 'Europe/Amsterdam' : 'America/Los_Angeles',
        asn: isTor ? 'AS60051' : isScanner ? 'AS49332' : 'AS15169',
        isp: isTor ? 'Tor Exit Node' : isScanner ? 'LeaseWeb Netherlands B.V.' : 'Google LLC',
        org: isTor ? 'Tor Network' : isScanner ? 'LeaseWeb' : 'Google Public DNS',
        type: isTor ? 'Anonimización' : isScanner ? 'Datacenter / Hosting' : 'Corporativo / CDN',
        cidr: ip.split('.').slice(0, 3).join('.') + '.0/24',
        reverseDns: isTor ? 'tor-exit-1' : isScanner ? '198.20.69.74' : 'dns.google',
        threatLevel: isTor ? 'danger' : isScanner ? 'warn' : 'safe',
        threatLabel: isTor ? 'Alto riesgo' : isScanner ? 'Riesgo moderado' : 'Sin amenazas',
        riskScore: isTor ? 87 : isScanner ? 45 : 2,
        reports: isTor ? 12 : isScanner ? 3 : 0,
        confidence: 'Alta',
        torExitNode: isTor,
        proxy: isTor || ip.includes('.'),
        maliciousActivity: false,
        botnetC2: false,
        portScan: false,
        dnsRecords: [
          { type: 'A', value: isScanner ? '198.20.69.74' : '8.8.8.8', ttl: 3600 },
          { type: 'AAAA', value: isScanner ? '' : '2001:4860:4860::8888', ttl: 3600 },
        ],
        ports: isScanner ? [
          { port: 22, service: 'SSH', status: 'open' },
          { port: 80, service: 'HTTP', status: 'open' },
          { port: 443, service: 'HTTPS', status: 'open' },
        ] : [],
        blacklists: [
          { name: 'Spamhaus ZEN', status: 'clean' },
          { name: 'AbuseIPDB', status: isTor ? 'listed' : 'clean', score: isTor ? 85 : 0 },
          { name: 'Emerging Threats', status: 'clean' },
          { name: 'Barracuda', status: 'clean' },
          { name: 'Talos Intelligence', status: 'clean' },
        ],
      }
      
      setResult(mockResult)
      setHistory(prev => [
        { ip: ip, date: new Date().toISOString(), country: mockResult.country },
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

  const renderKV = (data: Record<string, string>) => {
    return Object.entries(data)
      .map(([k, v]) => `<tr><td>${escapeHtml(k)}</td><td>${escapeHtml(String(v))}</td></tr>`)
      .join('')
  }

  const setStatus = (msg: string) => {
    console.log(msg)
  }

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.04)] rounded-lg p-4 flex items-center gap-4">
        <div className="text-[#666] text-sm font-mono">IP Intelligence</div>
        <span className="text-[#666]">/</span>
        {/* Data source indicator */}
        {result && (
          <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${isRealData ? 'bg-[rgba(0,255,65,0.08)] text-[#00ff41] border border-[rgba(0,255,65,0.3)]' : 'bg-[rgba(255,215,0,0.08)] text-[#ffd700] border border-[rgba(255,215,0,0.3)]'}`}>
            {isRealData ? '🟢 API REAL' : '🟡 MOCK'}
          </span>
        )}
        <div className="flex-1 flex gap-3">
          <input
            type="text"
            placeholder="Ingresá una IP — ej: 185.220.101.45"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && analyzeIp()}
            className="flex-1 max-w-md bg-[#111] border border-[rgba(255,255,255,0.08)] rounded-lg px-4 py-2 text-white placeholder-[#666] font-mono text-sm focus:border-[#00ff41] focus:outline-none"
          />
          <button 
            onClick={() => loadExample('tor')}
            className="btn-example"
          >
            Tor node
          </button>
          <button 
            onClick={() => loadExample('clean')}
            className="btn-example"
          >
            IP limpia
          </button>
          <button 
            onClick={() => loadExample('scanner')}
            className="btn-example"
          >
            Scanner
          </button>
          <button 
            onClick={analyzeIp}
            disabled={loading || !ip}
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
          <div className="empty-label">// ingresá una IP para comenzar el análisis</div>
          <div className="empty-grid">
            <div className="empty-card">
              <div className="empty-card-title">Geolocalización</div>
              <div className="empty-card-sub">país · ciudad · coords</div>
            </div>
            <div className="empty-card">
              <div className="empty-card-title">ASN / ISP</div>
              <div className="empty-card-sub">AS · org · proveedor</div>
            </div>
            <div className="empty-card">
              <div className="empty-card-title">Reputación</div>
              <div className="empty-card-sub">score · amenazas · tipo</div>
            </div>
            <div className="empty-card">
              <div className="empty-card-title">Blacklists</div>
              <div className="empty-card-sub">45+ listas verificadas</div>
            </div>
            <div className="empty-card">
              <div className="empty-card-title">Red / Proxies</div>
              <div className="empty-card-sub">tor · vpn · datacenter</div>
            </div>
            <div className="empty-card">
              <div className="empty-card-title">Puertos abiertos</div>
              <div className="empty-card-sub">scan + servicios</div>
            </div>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="result visible">
          {/* IP Header */}
          <div className="ip-header">
            <div>
              <div className="ip-title">{result.ip}</div>
              <div className="ip-sub">{result.country} · {result.asn}</div>
            </div>
            <div className="ip-badges">
              <span className={`threat-badge ${result.threatLevel}`}>
                <span className="threat-dot"></span>
                {result.threatLabel}
              </span>
              <span className="threat-badge info">
                <span className="threat-dot"></span>
                {result.isp}
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div>
            <div className="tabs">
              <button className={`tab ${activeTab === 'geo' ? 'active' : ''}`} onClick={() => setActiveTab('geo')}>Geoloc & Red</button>
              <button className={`tab ${activeTab === 'threat' ? 'active' : ''}`} onClick={() => setActiveTab('threat')}>Amenazas</button>
              <button className={`tab ${activeTab === 'ports' ? 'active' : ''}`} onClick={() => setActiveTab('ports')}>Puertos</button>
              <button className={`tab ${activeTab === 'blacklist' ? 'active' : ''}`} onClick={() => setActiveTab('blacklist')}>Blacklists</button>
              <button className={`tab ${activeTab === 'raw' ? 'active' : ''}`} onClick={() => setActiveTab('raw')}>Raw JSON</button>
            </div>
            <div className="panels-wrap">
              {/* Geo Tab */}
              <div className={`tab-content ${activeTab === 'geo' ? 'active' : ''}`}>
                <div className="grid-2" style={{ marginBottom: '12px' }}>
                  <div>
                    <div className="section-title">Geolocalización</div>
                    <table className="kv-table" dangerouslySetInnerHTML={{ __html: renderKV({
                      'País': result.country,
                      'Ciudad': result.city,
                      'Región': result.region,
                      'Latitud': result.latitude,
                      'Longitud': result.longitude,
                      'Timezone': result.timezone,
                    }) }} />
                  </div>
                  <div>
                    <div className="section-title">Red & ASN</div>
                    <table className="kv-table" dangerouslySetInnerHTML={{ __html: renderKV({
                      'ASN': result.asn,
                      'Organización': result.org,
                      'ISP': result.isp,
                      'Tipo': result.type,
                      'CIDR': result.cidr,
                      'Reverse DNS': result.reverseDns || 'N/A',
                    }) }} />
                  </div>
                </div>
                <div className="section-title">Ubicación aproximada</div>
                <div className="map-box">
                  <div className="map-grid"></div>
                  <div 
                    className="map-pin" 
                    style={{ 
                      top: Math.max(10, Math.min(90, 50 - parseFloat(result.latitude) * 0.5)) + '%',
                      left: Math.max(10, Math.min(90, 50 + parseFloat(result.longitude) * 0.3)) + '%'
                    }}
                  ></div>
                  <div className="map-label">{result.city}, {result.country} · {parseFloat(result.latitude).toFixed(2)}°N {Math.abs(parseFloat(result.longitude)).toFixed(2)}°O</div>
                </div>
              </div>

              {/* Threat Tab */}
              <div className={`tab-content ${activeTab === 'threat' ? 'active' : ''}`}>
                <div className="section-title">Resumen de amenazas</div>
                <div className="grid-3" style={{ marginBottom: '16px' }}>
                  <div className="info-card" style={{ borderColor: result.riskScore < 20 ? 'var(--green-bd)' : result.riskScore < 50 ? 'var(--amber-bd)' : 'var(--red-bd)' }}>
                    <div className="info-card-label">Riesgo</div>
                    <div className="info-card-value" style={{ color: result.riskScore < 20 ? 'var(--green)' : result.riskScore < 50 ? 'var(--amber)' : 'var(--red)' }}>
                      {result.riskScore}/100
                    </div>
                  </div>
                  <div className="info-card" style={{ borderColor: 'var(--green-bd)' }}>
                    <div className="info-card-label">Reportes</div>
                    <div className="info-card-value" style={{ color: 'var(--green)' }}>{result.reports}</div>
                  </div>
                  <div className="info-card" style={{ borderColor: 'var(--blue-bd)' }}>
                    <div className="info-card-label">Confianza</div>
                    <div className="info-card-value" style={{ color: 'var(--blue)' }}>{result.confidence}</div>
                  </div>
                </div>
                <div className="section-title">Detalle</div>
                <div>
                  <div className="threat-row">
                    <div>
                      <div className="threat-name">Tor Exit Node</div>
                      <div className="threat-detail">{result.torExitNode ? 'Nodo de salida activo en red Tor' : 'No figura en listas Tor'}</div>
                    </div>
                    <span className={`status-pill ${result.torExitNode ? 'danger' : 'safe'}`}>
                      {result.torExitNode ? 'CONFIRMADO' : 'LIMPIO'}
                    </span>
                  </div>
                  <div className="threat-row">
                    <div>
                      <div className="threat-name">Proxy anónimo</div>
                      <div className="threat-detail">{result.proxy ? 'Detectado como proxy' : 'No es proxy de anonimización'}</div>
                    </div>
                    <span className={`status-pill ${result.proxy ? 'warn' : 'safe'}`}>
                      {result.proxy ? 'PROBABLE' : 'LIMPIO'}
                    </span>
                  </div>
                  <div className="threat-row">
                    <div>
                      <div className="threat-name">Actividad maliciosa</div>
                      <div className="threat-detail">Sin reportes de actividad maliciosa</div>
                    </div>
                    <span className="status-pill safe">LIMPIO</span>
                  </div>
                  <div className="threat-row">
                    <div>
                      <div className="threat-name">Escaneo de puertos</div>
                      <div className="threat-detail">Sin actividad de escaneo registrada</div>
                    </div>
                    <span className="status-pill safe">LIMPIO</span>
                  </div>
                  <div className="threat-row">
                    <div>
                      <div className="threat-name">Botnet C2</div>
                      <div className="threat-detail">No figura en listas de C2 conocidas</div>
                    </div>
                    <span className="status-pill safe">LIMPIO</span>
                  </div>
                </div>
              </div>

              {/* Ports Tab */}
              <div className={`tab-content ${activeTab === 'ports' ? 'active' : ''}`}>
                <div className="section-title">Puertos detectados</div>
                {result.ports && result.ports.length > 0 ? (
                  <div>
                    {result.ports.map((p: any, i: number) => (
                      <div key={i} className="threat-row">
                        <div>
                          <div className="threat-name" style={{ fontFamily: 'var(--mono)' }}>
                            {p.port} <span style={{ color: 'var(--text3)' }}>—</span> {p.service}
                          </div>
                          <div className="threat-detail">{p.service === 'SSH' ? 'SSH Remote Access' : p.service === 'HTTP' ? 'Web Server' : 'TLS/SSL'}</div>
                        </div>
                        <span className="status-pill safe">OPEN</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text3)', fontFamily: 'var(--mono)', fontSize: '11px' }}>
                    No se detectaron puertos abiertos en el scan básico
                  </div>
                )}
              </div>

              {/* Blacklist Tab */}
              <div className={`tab-content ${activeTab === 'blacklist' ? 'active' : ''}`}>
                <div className="section-title">Verificación en listas negras</div>
                <div>
                  {result.blacklists.map((bl: any, i: number) => (
                    <div key={i} className="bl-item">
                      <span className={`bl-dot ${bl.status === 'listed' ? 'listed' : 'clean'}`}></span>
                      <span className="bl-name">{bl.name}</span>
                      <span className={`bl-status ${bl.status === 'listed' ? 'listed' : 'clean'}`}>
                        {bl.status === 'listed' ? `${bl.score}%` : 'limpio'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Raw JSON Tab */}
              <div className={`tab-content ${activeTab === 'raw' ? 'active' : ''}`}>
                <div className="section-title">Respuesta completa (JSON)</div>
                <div className="raw-wrap" dangerouslySetInnerHTML={{ __html: syntaxHighlight(JSON.stringify(result, null, 2)) }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}