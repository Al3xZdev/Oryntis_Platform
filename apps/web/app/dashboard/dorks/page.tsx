'use client'

import { useState } from 'react'
import { Search, FileText, Shield, AlertTriangle, Copy, ExternalLink, Download } from 'lucide-react'

// Templates
const TEMPLATES = [
  { cat: 'recon', name: 'Subdominios indexados', dork: 'site:*.{target}.com -www', desc: 'Enumera subdominios sin www indexados en Google.' },
  { cat: 'recon', name: 'Directorios abiertos', dork: 'intitle:"Index of" site:{target}.com', desc: 'Detecta listados de directorio habilitados.' },
  { cat: 'recon', name: 'Páginas con errores SQL', dork: 'site:{target}.com intext:"error" intext:"SQL"', desc: 'Mensajes de error SQL visibles en producción.' },
  { cat: 'recon', name: 'Tecnología expuesta', dork: 'site:{target}.com intext:"Powered by"', desc: 'Identifica frameworks y versiones en uso.' },
  { cat: 'vuln', name: 'Paneles phpMyAdmin', dork: 'inurl:phpmyadmin intitle:phpmyadmin', desc: 'Localiza instancias phpMyAdmin públicas.' },
  { cat: 'vuln', name: 'Archivos .env expuestos', dork: 'inurl:.env intext:"DB_PASSWORD"', desc: 'Archivos de configuración de entorno accesibles.' },
  { cat: 'leak', name: 'Contraseñas en texto plano', dork: 'intext:"password" filetype:txt site:{target}.com', desc: 'Archivos .txt con posibles credenciales.' },
  { cat: 'leak', name: 'Claves API expuestas', dork: 'intext:"api_key" OR intext:"apikey" site:{target}', desc: 'Claves API en código indexado.' },
  { cat: 'login', name: 'Panel de administración', dork: 'site:{target}.com inurl:admin intitle:login', desc: 'Interfaces de administración accesibles.' },
  { cat: 'login', name: 'Login WordPress', dork: 'site:{target}.com inurl:wp-login.php', desc: 'Páginas de inicio de sesión WordPress.' },
  { cat: 'files', name: 'PDFs confidenciales', dork: 'site:{target}.com filetype:pdf "confidential"', desc: 'Documentos PDF marcados como confidenciales.' },
  { cat: 'files', name: 'Hojas de cálculo expuestas', dork: 'site:{target}.com filetype:xls "contraseña"', desc: 'Archivos Excel con datos sensibles.' },
]

const MOCK_RESULTS = [
  { title: 'Directorio abierto — /uploads — example.com', url: 'https://example.com/uploads/', desc: 'Listado de directorio del servidor con archivos PDF e imágenes. Sin autenticación.', tags: ['uploads', 'directory listing', 'pdf'], sev: 'high' },
  { title: 'Manual de Procedimientos Q1 2024 — example.com', url: 'https://example.com/docs/manual_q1_2024.pdf', desc: 'Documento interno con procedimientos operativos y datos de contacto de empleados.', tags: ['pdf', 'interno', 'procesos'], sev: 'medium' },
  { title: 'Archivo de configuración backup — example.com', url: 'https://example.com/backup/config.sql.bak', desc: 'Copia de seguridad de base de datos con estructura completa. Tamaño: 4.2 MB.', tags: ['backup', 'sql', 'database'], sev: 'high' },
  { title: 'Informe financiero 2023 — example.com', url: 'https://example.com/reports/financiero_2023.pdf', desc: 'Reporte con cifras de ingresos y proyecciones. Accesible sin restricciones.', tags: ['pdf', 'financiero', 'reporte'], sev: 'medium' },
  { title: 'Lista de clientes exportada — example.com', url: 'https://example.com/exports/clientes_2024.xls', desc: 'Exportación de base de datos de clientes con nombre, email y teléfono.', tags: ['xls', 'clientes', 'pii'], sev: 'high' },
]

export default function DorksPage() {
  const [dork, setDork] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [activeCat, setActiveCat] = useState('all')
  const [activeTab, setActiveTab] = useState('results')
  const [history, setHistory] = useState<Array<{dork: string, results: number}>>([])

  const filteredTemplates = activeCat === 'all' ? TEMPLATES : TEMPLATES.filter(t => t.cat === activeCat)

  const loadTemplate = (templateDork: string) => {
    setDork(templateDork)
  }

  const runDork = async () => {
    if (!dork) return
    
    setLoading(true)
    
    // Detect operators and compute risk
    const ops = detectOperators(dork)
    const risk = computeRisk(dork)
    const cat = detectCategory(dork)
    
    setTimeout(() => {
      setResult({
        dork: dork,
        operators: ops,
        risk: risk,
        category: cat,
        results: MOCK_RESULTS,
        time: (Math.random() * 1.5 + 0.4).toFixed(2),
      })
      setHistory(prev => [
        { dork: dork, results: MOCK_RESULTS.length },
        ...prev.slice(0, 9)
      ])
      setLoading(false)
    }, 1600)
  }

  const detectOperators = (d: string) => {
    const map = [
      { re: /site:([^\s]+)/gi, op: 'site:', desc: 'Dominio restringido' },
      { re: /filetype:([^\s]+)/gi, op: 'filetype:', desc: 'Tipo de archivo' },
      { re: /inurl:([^\s]+)/gi, op: 'inurl:', desc: 'Texto en URL' },
      { re: /intitle:([^\s]+)/gi, op: 'intitle:', desc: 'Texto en título' },
      { re: /intext:([^\s]+)/gi, op: 'intext:', desc: 'Texto en contenido' },
    ]
    const found: Array<{ op: string; value: string; desc: string }> = []
    map.forEach(p => {
      const re = new RegExp(p.re.source, 'gi')
      let m: RegExpExecArray | null
      while ((m = re.exec(d))) found.push({ op: p.op, value: m[1], desc: p.desc })
    })
    return found
  }

  const computeRisk = (d: string) => {
    const keywords = ['password', 'contraseña', 'passwd', 'secret', 'api_key', 'token', 'db_password', '.env', 'config', 'backup', 'sql', 'bak', 'dump']
    const hits = keywords.filter(k => d.toLowerCase().includes(k)).length
    if (hits >= 3) return { level: 'critical', label: 'Crítico', color: 'var(--red)' }
    if (hits >= 2) return { level: 'high', label: 'Alto', color: 'var(--red)' }
    if (hits >= 1) return { level: 'medium', label: 'Medio', color: 'var(--amber)' }
    return { level: 'low', label: 'Bajo', color: 'var(--green)' }
  }

  const detectCategory = (d: string) => {
    const lower = d.toLowerCase()
    if (lower.includes('login') || lower.includes('admin') || lower.includes('wp-login')) return 'Paneles de acceso'
    if (lower.includes('password') || lower.includes('api_key') || lower.includes('.env')) return 'Filtraciones'
    if (lower.includes('filetype') || lower.includes('ext:')) return 'Archivos sensibles'
    if (lower.includes('index of') || lower.includes('site:')) return 'Reconocimiento'
    return 'General'
  }

  const escapeHtml = (s: string) => {
    const div = document.createElement('div')
    div.textContent = s
    return div.innerHTML
  }

  const copyDork = () => {
    navigator.clipboard.writeText(dork)
  }

  const openInGoogle = () => {
    window.open('https://www.google.com/search?q=' + encodeURIComponent(dork), '_blank')
  }

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.04)] rounded-lg p-4 flex items-center gap-4">
        <div className="text-[#666] text-sm font-mono" style={{ color: 'var(--amber)' }}>Google Dorks</div>
        <span className="text-[#666]">/</span>
        <div className="flex-1 flex gap-3">
          <input
            type="text"
            placeholder='Ej: site:example.com filetype:pdf "contraseña"'
            value={dork}
            onChange={(e) => setDork(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && runDork()}
            className="flex-1 max-w-lg bg-[#111] border border-[rgba(255,255,255,0.08)] rounded-lg px-4 py-2 text-white placeholder-[#666] font-mono text-sm focus:border-[#ffd700] focus:outline-none"
          />
          <button 
            onClick={runDork}
            disabled={loading || !dork}
            style={{ 
              height: '32px', 
              padding: '0 16px', 
              background: 'var(--amber)', 
              border: 'none', 
              borderRadius: '6px',
              color: '#000', 
              fontSize: '12px', 
              fontWeight: 600,
              cursor: 'pointer',
              opacity: loading || !dork ? 0.4 : 1
            }}
          >
            {loading ? 'Ejecutando...' : 'Ejecutar'}
          </button>
        </div>
      </div>

      {/* Loading Bar */}
      <div className={`loading-bar ${loading ? 'active' : ''}`}>
        <div className="loading-fill" style={{ background: 'var(--amber)' }}></div>
      </div>

      {/* Empty State */}
      {!result && !loading && (
        <div className="empty-state" style={{ alignItems: 'flex-start', padding: '32px 0' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--amber-bg)', border: '0.5px solid var(--amber-bd)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', color: 'var(--amber)' }}>
            🔍
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>Google Dorks · Búsqueda Avanzada</div>
            <div style={{ fontSize: '12px', fontFamily: 'var(--mono)', color: 'var(--text4)' }}>Construye consultas para descubrir información expuesta en la web</div>
          </div>

          <div className="cat-tabs">
            <button className={`cat-tab ${activeCat === 'all' ? 'active' : ''}`} onClick={() => setActiveCat('all')}>Todos <span className="cat-count">{TEMPLATES.length}</span></button>
            <button className={`cat-tab ${activeCat === 'recon' ? 'active' : ''}`} onClick={() => setActiveCat('recon')}>Reconocimiento <span className="cat-count">{TEMPLATES.filter(t => t.cat === 'recon').length}</span></button>
            <button className={`cat-tab ${activeCat === 'vuln' ? 'active' : ''}`} onClick={() => setActiveCat('vuln')}>Vulnerabilidades <span className="cat-count">{TEMPLATES.filter(t => t.cat === 'vuln').length}</span></button>
            <button className={`cat-tab ${activeCat === 'leak' ? 'active' : ''}`} onClick={() => setActiveCat('leak')}>Filtraciones <span className="cat-count">{TEMPLATES.filter(t => t.cat === 'leak').length}</span></button>
            <button className={`cat-tab ${activeCat === 'login' ? 'active' : ''}`} onClick={() => setActiveCat('login')}>Paneles acceso <span className="cat-count">{TEMPLATES.filter(t => t.cat === 'login').length}</span></button>
            <button className={`cat-tab ${activeCat === 'files' ? 'active' : ''}`} onClick={() => setActiveCat('files')}>Archivos <span className="cat-count">{TEMPLATES.filter(t => t.cat === 'files').length}</span></button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '8px', width: '100%' }}>
            {filteredTemplates.map((t, i) => (
              <div key={i} className="template-card" onClick={() => loadTemplate(t.dork)}>
                <div className="template-header">
                  <div className="template-name">{t.name}</div>
                  <span className={`template-tag tag-${t.cat}`}>{t.cat}</span>
                </div>
                <div className="template-dork">{t.dork}</div>
                <div className="template-desc">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="result visible" style={{ maxWidth: '100%' }}>
          {/* Dork Header */}
          <div className="dork-header">
            <div className="dork-header-top">
              <div>
                <div className="dork-query-label">Consulta activa</div>
                <div className="dork-query-text">{result.dork}</div>
              </div>
              <div className="dork-actions">
                <button className="btn-action" onClick={copyDork}>⎘ Copiar</button>
                <button className="btn-action primary" onClick={openInGoogle}>↗ Google</button>
              </div>
            </div>
            <div className="dork-metrics">
              <div className="dork-metric">
                <div className="dork-metric-label">Resultados sim.</div>
                <div className="dork-metric-value" style={{ color: 'var(--amber)' }}>{result.results.length} encontrados</div>
              </div>
              <div className="dork-metric">
                <div className="dork-metric-label">Operadores</div>
                <div className="dork-metric-value">{result.operators.length} detectado{result.operators.length !== 1 ? 's' : ''}</div>
              </div>
              <div className="dork-metric">
                <div className="dork-metric-label">Riesgo estimado</div>
                <div className="dork-metric-value" style={{ color: result.risk.color }}>{result.risk.label}</div>
              </div>
              <div className="dork-metric">
                <div className="dork-metric-label">Categoría</div>
                <div className="dork-metric-value" style={{ fontSize: '11px' }}>{result.category}</div>
              </div>
              <div className="dork-metric">
                <div className="dork-metric-label">Tiempo sim.</div>
                <div className="dork-metric-value">{result.time}s</div>
              </div>
            </div>
          </div>

          {/* Alert strip */}
          {(result.risk.level === 'high' || result.risk.level === 'critical') && (
            <div className="alert-strip">
              ⚠️ Esta consulta puede exponer información sensible. Úsela solo en sistemas con autorización explícita.
            </div>
          )}

          {/* Results Panel */}
          <div className="results-panel" style={{ maxWidth: '100%' }}>
            <div className="panel-header">
              <div className="panel-title">Resultados simulados <span className="panel-count">{result.results.length}</span></div>
            </div>
            <div className="tabs">
              <button className={`tab ${activeTab === 'results' ? 'active' : ''}`} onClick={() => setActiveTab('results')}>Resultados</button>
              <button className={`tab ${activeTab === 'operators' ? 'active' : ''}`} onClick={() => setActiveTab('operators')}>Análisis operadores</button>
              <button className={`tab ${activeTab === 'raw' ? 'active' : ''}`} onClick={() => setActiveTab('raw')}>Raw</button>
            </div>

            {/* Results Tab */}
            <div className={`tab-content ${activeTab === 'results' ? 'active' : ''}`}>
              <div className="scroll-list">
                {result.results.map((r: any, i: number) => (
                  <div key={i} className="result-item">
                    <div className="result-item-header">
                      <a className="result-item-title" href={r.url} target="_blank" rel="noopener noreferrer">{r.title}</a>
                      <span className={`result-item-badge badge-${r.sev}`}>
                        {r.sev === 'high' ? 'ALTO' : r.sev === 'medium' ? 'MEDIO' : 'BAJO'}
                      </span>
                    </div>
                    <div className="result-item-url">{r.url}</div>
                    <div className="result-item-desc">{r.desc}</div>
                    <div className="result-item-tags">
                      {r.tags.map((t: string, j: number) => (
                        <span key={j} className="result-tag">{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Operators Tab */}
            <div className={`tab-content ${activeTab === 'operators' ? 'active' : ''}`}>
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ fontSize: '9px', fontFamily: 'var(--mono)', color: 'var(--text4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Operadores detectados en la consulta</div>
                {result.operators.length > 0 ? (
                  result.operators.map((o: any, i: number) => (
                    <div key={i} style={{ background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: '6px', padding: '10px 12px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--amber)', minWidth: '90px' }}>{o.op}</span>
                      <div>
                        <div style={{ fontSize: '12px', color: 'var(--text)', marginBottom: '2px' }}>{o.desc}</div>
                        <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text4)' }}>Valor: <span style={{ color: 'var(--blue)' }}>{o.value}</span></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text4)', fontFamily: 'var(--mono)', fontSize: '11px' }}>No se detectaron operadores especiales</div>
                )}
              </div>
            </div>

            {/* Raw Tab */}
            <div className={`tab-content ${activeTab === 'raw' ? 'active' : ''}`}>
              <div className="raw-wrap" dangerouslySetInnerHTML={{ __html: `
<span class="key">"dork"</span>: <span class="str">"${escapeHtml(result.dork)}"</span>
<span class="key">"operadores"</span>: [${result.operators.map((o: any) => `<span class="str">"${o.op}"</span>`).join(', ')}]
<span class="key">"riesgo"</span>: <span style="color:${result.risk.color}">"${result.risk.level}"</span>
<span class="key">"resultados_sim"</span>: ${result.results.length}
<span class="key">"categoria"</span>: <span class="str">"${result.category}"</span>
<span class="key">"google_url"</span>: <span class="str">"https://www.google.com/search?q=${encodeURIComponent(result.dork)}"</span>
              ` }} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}