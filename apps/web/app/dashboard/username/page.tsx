'use client'

import { useState } from 'react'
import { User, Search, Globe, ExternalLink } from 'lucide-react'
import {
  FaGithub, FaTwitter, FaInstagram, FaReddit, FaYoutube,
  FaWordpress, FaMedium, FaDev, FaTwitch, FaDiscord, FaSteam,
  FaSpotify, FaSoundcloud, FaLinkedin, FaSnapchat, FaTumblr,
  FaStackOverflow, FaGitlab, FaBitbucket, FaDocker, FaSlack,
  FaPaypal, FaAmazon, FaEtsy, FaTiktok, FaPinterest,
  FaRedditAlien, FaAws, FaGlobe, FaCloud,
  FaUnity, FaPlaystation, FaXbox, FaMeetup, FaProductHunt,
  FaDribbble, FaBehance, FaDeviantart,
  FaFlickr, FaVimeo, FaMixcloud, FaBandcamp,
  FaLastfm, FaBlog,
  FaBlogger, FaGhost,
  FaCodepen,
  FaWeixin, FaWhatsapp, FaTelegram, FaWeibo,
  FaGoogle, FaApple, FaMicrosoft,
  FaUber, FaAirbnb,
} from 'react-icons/fa'

// Mapeo de iconos para redes sociales
const SOCIAL_ICONS: Record<string, any> = {
  // Principales
  'GitHub': FaGithub,
  'Twitter/X': FaTwitter,
  'Instagram': FaInstagram,
  'Reddit': FaReddit,
  'YouTube': FaYoutube,
  'TikTok': FaTiktok,
  'LinkedIn': FaLinkedin,
  'Pinterest': FaPinterest,
  'Snapchat': FaSnapchat,
  'Tumblr': FaTumblr,

  // Código/Dev
  'GitLab': FaGitlab,
  'Bitbucket': FaBitbucket,
  'Stack Overflow': FaStackOverflow,
  'DEV.to': FaDev,
  'CodePen': FaCodepen,
  'Docker': FaDocker,
  'AWS': FaAws,

  // Gaming/Streaming
  'Twitch': FaTwitch,
  'Discord': FaDiscord,
  'Steam': FaSteam,
  'Roblox': FaUnity,
  'PlayStation': FaPlaystation,
  'Xbox': FaXbox,

  // Música/Audio
  'Spotify': FaSpotify,
  'SoundCloud': FaSoundcloud,
  'Bandcamp': FaBandcamp,
  'Mixcloud': FaMixcloud,
  'Last.fm': FaLastfm,
  'Vimeo': FaVimeo,

  // Blogging
  'Medium': FaMedium,
  'WordPress': FaWordpress,
  'Blogger': FaBlogger,
  'Ghost': FaGhost,

  // Arte/Diseño
  'Behance': FaBehance,
  'Dribbble': FaDribbble,
  'DeviantArt': FaDeviantart,
  'Flickr': FaFlickr,

  // Messaging
  'Telegram': FaTelegram,
  'WhatsApp': FaWhatsapp,
  'WeChat': FaWeixin,
  'Slack': FaSlack,
  'Weibo': FaWeibo,

  // E-commerce
  'Etsy': FaEtsy,
  'Amazon': FaAmazon,

  // Fintech
  'PayPal': FaPaypal,

  // Viajes
  'Airbnb': FaAirbnb,
  'Uber': FaUber,

  // Misc
  'Product Hunt': FaProductHunt,
  'Meetup': FaMeetup,
  'Google': FaGoogle,
  'Apple': FaApple,
  'Microsoft': FaMicrosoft,
}

// Función para obtener el icono de una red social
const getSocialIcon = (name: string) => {
  return SOCIAL_ICONS[name] || FaGlobe
}

// Estilos de color para cada plataforma
const SOCIAL_STYLES: Record<string, { bg: string, text: string }> = {
  // Redes principales
  'GitHub': { bg: 'bg-[#333]', text: 'text-white' },
  'Twitter/X': { bg: 'bg-[#000]', text: 'text-white' },
  'Instagram': { bg: 'bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737]', text: 'text-white' },
  'Reddit': { bg: 'bg-[#FF4500]', text: 'text-white' },
  'YouTube': { bg: 'bg-[#FF0000]', text: 'text-white' },
  'TikTok': { bg: 'bg-[#000]', text: 'text-white' },
  'LinkedIn': { bg: 'bg-[#0A66C2]', text: 'text-white' },
  'Pinterest': { bg: 'bg-[#E60023]', text: 'text-white' },
  'Snapchat': { bg: 'bg-[#FFFC00]', text: 'text-black' },
  'Tumblr': { bg: 'bg-[#001935]', text: 'text-white' },
  'Facebook': { bg: 'bg-[#1877F2]', text: 'text-white' },
  
  // Código/Dev
  'GitLab': { bg: 'bg-[#FC6D26]', text: 'text-white' },
  'Bitbucket': { bg: 'bg-[#0052CC]', text: 'text-white' },
  'Stack Overflow': { bg: 'bg-[#F48024]', text: 'text-white' },
  'DEV.to': { bg: 'bg-[#0A0A0A]', text: 'text-white' },
  'Replit': { bg: 'bg-[#667EEA]', text: 'text-white' },
  'CodePen': { bg: 'bg-[#000]', text: 'text-white' },
  'Docker': { bg: 'bg-[#2496ED]', text: 'text-white' },
  'AWS': { bg: 'bg-[#FF9900]', text: 'text-white' },
  
  // Gaming/Streaming
  'Twitch': { bg: 'bg-[#9146FF]', text: 'text-white' },
  'Discord': { bg: 'bg-[#5865F2]', text: 'text-white' },
  'Steam': { bg: 'bg-[#171a21]', text: 'text-white' },
  'Roblox': { bg: 'bg-[#EE1D23]', text: 'text-white' },
  'PlayStation': { bg: 'bg-[#003791]', text: 'text-white' },
  'Xbox': { bg: 'bg-[#107C10]', text: 'text-white' },
  
  // Música
  'Spotify': { bg: 'bg-[#1DB954]', text: 'text-white' },
  'SoundCloud': { bg: 'bg-[#FF5500]', text: 'text-white' },
  'Bandcamp': { bg: 'bg-[#629AA8]', text: 'text-white' },
  'Mixcloud': { bg: 'bg-[#D32300]', text: 'text-white' },
  'Vimeo': { bg: 'bg-[#1AB7EA]', text: 'text-white' },
  
  // Blogging
  'Medium': { bg: 'bg-[#000]', text: 'text-white' },
  'WordPress': { bg: 'bg-[#21759B]', text: 'text-white' },
  'Ghost': { bg: 'bg-[#738A94]', text: 'text-white' },
  'Substack': { bg: 'bg-[#FF671B]', text: 'text-white' },
  
  // Arte/Diseño
  'Behance': { bg: 'bg-[#1769FF]', text: 'text-white' },
  'Dribbble': { bg: 'bg-[#EA4C89]', text: 'text-white' },
  'DeviantArt': { bg: 'bg-[#00E59B]', text: 'text-black' },
  'Flickr': { bg: 'bg-[#0063DC]', text: 'text-white' },
  
  // Messaging
  'Telegram': { bg: 'bg-[#0088CC]', text: 'text-white' },
  'WhatsApp': { bg: 'bg-[#25D366]', text: 'text-white' },
  'WeChat': { bg: 'bg-[#07C160]', text: 'text-white' },
  'Slack': { bg: 'bg-[#4A154B]', text: 'text-white' },
  'Line': { bg: 'bg-[#00C300]', text: 'text-white' },
  'Weibo': { bg: 'bg-[#E6162D]', text: 'text-white' },
  
  // E-commerce
  'Etsy': { bg: 'bg-[#F56400]', text: 'text-white' },
  'Amazon': { bg: 'bg-[#FF9900]', text: 'text-black' },
  
  // Fintech
  'PayPal': { bg: 'bg-[#003087]', text: 'text-white' },
  'Patreon': { bg: 'bg-[#FF424D]', text: 'text-white' },
  
  // Viajes
  'Airbnb': { bg: 'bg-[#FF5A5F]', text: 'text-white' },
  'Uber': { bg: 'bg-[#000]', text: 'text-white' },
  
  // Misc
  'Product Hunt': { bg: 'bg-[#DA552F]', text: 'text-white' },
  'Meetup': { bg: 'bg-[#F12826]', text: 'text-white' },
}

const getSocialStyle = (name: string) => {
  return SOCIAL_STYLES[name] || { bg: 'bg-[#666]', text: 'text-white' }
}

// Examples for quick testing
const EXAMPLES = {
  Kyuler: 'Kyuler',
  admin: 'admin',
  test: 'test',
}

export default function UsernamePage() {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [history, setHistory] = useState<Array<{username: string, found: number}>>([])

  const loadExample = (key: string) => {
    setUsername(EXAMPLES[key as keyof typeof EXAMPLES])
  }

  const analyzeUsername = async () => {
    if (!username || username.length < 2) return
    
    setLoading(true)
    setResult(null)
    
    // Llamar a la API real del backend
    try {
      const res = await fetch('http://localhost:5000/api/osint/username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      })
      
      if (!res.ok) throw new Error(`API error: ${res.status}`)
      
      const data = await res.json()
      console.log('Username API Response:', data)
      
      setResult(data)
      setHistory(prev => [
        { username: username, found: data.found_count || 0 },
        ...prev.slice(0, 9)
      ])
    } catch (err) {
      console.error('Username API Error:', err)
      
      // Fallback a datos mock si la API falla
      const mockResult = {
        success: true,
        username: username,
        found_count: 0,
        found: [],
        execution_time_ms: 0,
        error: 'API no disponible, usando datos de ejemplo',
      }
      setResult(mockResult)
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

  const exportJSON = () => {
    if (!result) return
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `username-${result.username}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.04)] rounded-lg p-4 flex items-center gap-4">
        <div className="text-[#666] text-sm font-mono">Username</div>
        <span className="text-[#666]">/</span>
        <div className="flex-1 flex gap-3">
          <input
            type="text"
            placeholder="Ingresá un username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && analyzeUsername()}
            className="flex-1 max-w-xs bg-[#111] border border-[rgba(255,255,255,0.08)] rounded-lg px-4 py-2 text-white placeholder-[#666] font-mono text-sm focus:border-[#00ff41] focus:outline-none"
          />
          <button 
            onClick={() => loadExample('Kyuler')}
            className="btn-example"
          >
            Kyuler
          </button>
          <button 
            onClick={() => loadExample('admin')}
            className="btn-example"
          >
            admin
          </button>
          <button 
            onClick={analyzeUsername}
            disabled={loading || !username}
            className="btn-analyze"
          >
            {loading ? 'Buscando...' : 'BUSCAR →'}
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
          <div className="empty-label">// ingresá un username para buscar en +100 plataformas</div>
          <div className="empty-grid">
            <div className="empty-card" onClick={() => loadExample('Kyuler')}>
              <div className="empty-card-title">🔍 Ejemplo 1</div>
              <div className="empty-card-sub">Kyuler</div>
            </div>
            <div className="empty-card" onClick={() => loadExample('admin')}>
              <div className="empty-card-title">🔍 Ejemplo 2</div>
              <div className="empty-card-sub">admin</div>
            </div>
            <div className="empty-card" onClick={() => loadExample('test')}>
              <div className="empty-card-title">🔍 Ejemplo 3</div>
              <div className="empty-card-sub">test</div>
            </div>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="result visible">
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: '#fff' }}>
                @{result.username}
              </div>
              <div style={{ fontSize: '12px', fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: '2px' }}>
                {result.found_count}+ perfiles encontrados en +100 plataformas
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn-example" onClick={exportJSON}>⤓ Exportar JSON</button>
            </div>
          </div>

          {/* Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            <div className="info-card" style={{ borderColor: 'var(--green-bd)' }}>
              <div className="info-card-label">Presencia confirmada</div>
              <div className="info-card-value" style={{ color: 'var(--green)' }}>{result.found_count}</div>
              <div className="info-card-sub">plataformas</div>
            </div>
            <div className="info-card">
              <div className="info-card-label">Plataformas</div>
              <div className="info-card-value" style={{ color: 'var(--text2)' }}>{result.searched_platforms || result.total_platforms || '+100'}</div>
              <div className="info-card-sub">buscadas</div>
            </div>
            <div className="info-card">
              <div className="info-card-label">Tiempo</div>
              <div className="info-card-value" style={{ color: 'var(--text2)' }}>{result.execution_time_ms}</div>
              <div className="info-card-sub">ms</div>
            </div>
            <div className="info-card" style={{ borderColor: 'var(--green-bd)' }}>
              <div className="info-card-label">Estado</div>
              <div className="info-card-value" style={{ color: 'var(--green)' }}>
                {result.found_count > 0 ? 'Activo' : 'Sin resultados'}
              </div>
              <div className="info-card-sub">
                {result.found_count > 0 ? 'presencia confirmada' : 'no encontrado'}
              </div>
            </div>
          </div>

          {/* Results Grid - Found */}
          <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: '8px', padding: '12px' }}>
            <div style={{ fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--green)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
              ✓ Perfiles Encontrados ({result.found?.length || 0})
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '8px' }}>
              {(result.found || []).map((p: any, i: number) => (
                <div 
                  key={`found-${i}`} 
                  className="platform-card"
                  onClick={() => window.open(p.url, '_blank')}
                  style={{ 
                    background: 'var(--bg3)', 
                    border: '0.5px solid var(--border)', 
                    borderRadius: '8px', 
                    padding: '14px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s, background 0.15s'
                  }}
                >
                  {(() => {
                    const IconComponent = getSocialIcon(p.platform || p.name)
                    const style = getSocialStyle(p.platform || p.name)
                    return IconComponent ? (
                      <div className={`w-7 h-7 rounded flex items-center justify-center ${style.bg} ${style.text}`}>
                        <IconComponent className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded flex items-center justify-center bg-[#333]">
                        <ExternalLink className="w-3.5 h-3.5 text-white" />
                      </div>
                    )
                  })()}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '2px' }}>{p.platform || p.name}</div>
                    <div style={{ fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--text3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.url}</div>
                  </div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', padding: '2px 8px', borderRadius: '3px', background: 'var(--green-bg)', color: 'var(--green)', border: '0.5px solid var(--green-bd)', whiteSpace: 'nowrap' }}>
                    ENCONTRADO
                  </div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text4)', whiteSpace: 'nowrap' }}>{p.response_time_ms}ms</div>
                </div>
              ))}
            </div>
          </div>

          {/* Results Grid - Not Found */}
          {result.not_found && result.not_found.length > 0 && (
            <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: '8px', padding: '12px', opacity: 0.7 }}>
              <div style={{ fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--text4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
                ✗ No Encontrados ({result.not_found.length})
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '8px' }}>
                {result.not_found.slice(0, 50).map((p: any, i: number) => (
                  <div 
                    key={`notfound-${i}`} 
                    style={{ 
                      background: 'var(--bg3)', 
                      border: '0.5px solid var(--border)', 
                      borderRadius: '8px', 
                      padding: '14px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px',
                      opacity: 0.6
                    }}
                  >
                    {(() => {
                      const IconComponent = getSocialIcon(p.platform || p.name)
                      const style = getSocialStyle(p.platform || p.name)
                      return IconComponent ? (
                        <div className={`w-7 h-7 rounded flex items-center justify-center ${style.bg} ${style.text}`}>
                          <IconComponent className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded flex items-center justify-center bg-[#333]">
                          <ExternalLink className="w-3.5 h-3.5 text-white" />
                        </div>
                      )
                    })()}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '2px', opacity: 0.6 }}>{p.platform || p.name}</div>
                      <div style={{ fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--text3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', opacity: 0.5 }}>{p.url}</div>
                    </div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', padding: '2px 8px', borderRadius: '3px', background: 'rgba(255,255,255,0.04)', color: 'var(--text4)', border: '0.5px solid var(--border)', whiteSpace: 'nowrap' }}>
                      NO ENCONTRADO
                    </div>
                  </div>
                ))}
              </div>
              {result.not_found.length > 50 && (
                <div style={{ fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--text4)', marginTop: '8px', textAlign: 'center' }}>
                  ... y {result.not_found.length - 50} más
                </div>
              )}
            </div>
          )}

          {/* Raw JSON */}
          <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: '8px', padding: '12px' }}>
            <div style={{ fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--text4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
              JSON
            </div>
            <div className="raw-wrap" dangerouslySetInnerHTML={{ __html: syntaxHighlight(JSON.stringify({
              username: result.username,
              found_count: result.found_count,
              platforms: result.found.map((p: any) => ({ name: p.name, url: p.url })),
            }, null, 2)) }} />
          </div>

          {/* Status msg */}
          <div style={{ padding: '8px 12px', background: 'var(--bg3)', borderRadius: '6px', fontSize: '11px', color: 'var(--text3)', fontFamily: 'var(--mono)', textAlign: 'center' }}>
            Listo · Username Checker v2.0
          </div>
        </div>
      )}
    </div>
  )
}