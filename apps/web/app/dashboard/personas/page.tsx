'use client'

import { useState, useRef, useCallback } from 'react'
import ForceGraph2D from 'react-force-graph-2d'
import { Search, User, Mail, Phone, Globe, Shield, Database, Activity, Calendar, Link2, FileText, Copy, Check, AlertTriangle, Camera, MapPin, Briefcase, Building, Users, Github, Linkedin, Twitter, Instagram, Youtube, MessageCircle, Facebook, Twitch, Lock, Unlock, CheckCircle, AlertCircle, Send, Hash, Bookmark, Clock, Target, TrendingUp, Code, BookOpen, Plane, Gamepad2, Pin, Rocket } from 'lucide-react'

const iconComponents: Record<string, React.ComponentType<{ className?: string }>> = {
  User, Mail, Phone, Globe, Shield, Database, Activity, Calendar, Link2, FileText, Copy, Check, AlertTriangle, Camera, MapPin, Briefcase, Building, Users, Github, Linkedin, Twitter, Instagram, Youtube, MessageCircle, Facebook, Twitch, Lock, Unlock, CheckCircle, AlertCircle, Send, 'Hash': Hash, Bookmark, Clock, Target, TrendingUp, Code, BookOpen, Plane, Gamepad2, Pin, Rocket,
}

const renderIcon = (iconName: string) => {
  const IconComp = iconComponents[iconName]
  if (!IconComp) return <User className="w-3 h-3" />
  return <IconComp className="w-3 h-3" />
}

const platformIconComponents: Record<string, React.ComponentType<{ className?: string }>> = {
  Github, Linkedin, Twitter, Instagram, Youtube, MessageCircle, Facebook, 'Hash': Hash, Code, BookOpen, Send, Gamepad2, Pin,
}

const renderPlatformIcon = (iconName: string) => {
  const IconComp = platformIconComponents[iconName]
  if (!IconComp) return <User className="w-3 h-3" />
  return <IconComp className="w-3 h-3" />
}

interface GraphNode {
  id: string
  name: string
  type: string
  val: number
}

interface GraphLink {
  source: string
  target: string
}

function RelationshipGraph({ data }: { data: any }) {
  const graphRef = useRef<any>()
  const nodeColors: Record<string, string> = {
    person: '#22c55e',
    company: '#3b82f6',
    domain: '#a855f7',
    email: '#f59e0b',
    phone: '#ec4899',
    platform: '#06b6d4',
  }

  const nodes: GraphNode[] = [
    { id: 'main', name: data.query, type: 'person', val: 20 },
  ]

  const links: GraphLink[] = []

  data.emails?.forEach((e: any) => {
    const id = `email_${nodes.length}`
    nodes.push({ id, name: e.addr.split('@')[0], type: 'email', val: 8 })
    links.push({ source: 'main', target: id })
  })

  data.phones?.forEach((p: any) => {
    const id = `phone_${nodes.length}`
    nodes.push({ id, name: p.num.slice(-8), type: 'phone', val: 8 })
    links.push({ source: 'main', target: id })
  })

  data.platforms?.filter((p: any) => p.status === 'found').slice(0, 6).forEach((p: any) => {
    const id = `platform_${nodes.length}`
    nodes.push({ id, name: p.name, type: 'platform', val: 8 })
    links.push({ source: 'main', target: id })
  })

  data.connections?.forEach((c: any) => {
    const id = `conn_${nodes.length}`
    nodes.push({ id, name: c.name, type: c.type, val: 10 })
    links.push({ source: 'main', target: id })
  })

  return (
    <div style={{ height: '220px', background: 'var(--bg3)', borderBottom: '1px solid var(--border)', position: 'relative' }}>
      <ForceGraph2D
        ref={graphRef}
        graphData={{ nodes, links }}
        width={340}
        height={220}
        backgroundColor="transparent"
        nodeColor={(node: any) => nodeColors[node.type as string] || '#22c55e'}
        nodeRelSize={6}
        linkColor={() => 'rgba(255,255,255,0.15)'}
        linkWidth={1}
        nodeCanvasObject={(node: any, ctx, globalScale) => {
          const r = Math.sqrt(node.val) * globalScale * 0.5
          ctx.beginPath()
          ctx.arc(node.x, node.y, r, 0, 2 * Math.PI)
          ctx.fillStyle = nodeColors[node.type as string] || '#22c55e'
          ctx.fill()
          if (node.id === 'main') {
            ctx.strokeStyle = '#fff'
            ctx.lineWidth = 2 / globalScale
            ctx.stroke()
          }
          ctx.font = `${9 / globalScale}px monospace`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillStyle = '#fff'
          const label = node.name.length > 12 ? node.name.slice(0, 10) + '..' : node.name
          ctx.fillText(label, node.x, node.y + r + 8 / globalScale)
        }}
        cooldownTicks={100}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
      />
      <div style={{ position: 'absolute', bottom: '6px', left: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {Object.entries(nodeColors).map(([type, color]) => (
          <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '8px', fontFamily: 'var(--mono)', color: 'var(--text3)' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: color }}></span>
            {type}
          </div>
        ))}
      </div>
    </div>
  )
}

function JsonPanel({ data }: { data: any }) {
  const [copied, setCopied] = useState(false)

  const jsonData = {
    query: data.query,
    persona: {
      name: data.query,
      confidence: data.confidence,
      identity: Object.fromEntries(data.identity?.map((r: any) => [r.key.replace(/ /g, '_').toLowerCase(), r.val]) || []),
      emails: data.emails?.map((e: any) => ({ address: e.addr, source: e.source, confidence: e.confidence })),
      phones: data.phones?.map((p: any) => ({ number: p.num, source: p.source, confidence: p.confidence })),
      platforms_found: data.platforms?.filter((p: any) => p.status === 'found').map((p: any) => p.name),
      breaches: data.breaches?.map((b: any) => ({ name: b.name, date: b.date, severity: b.sev, records: b.records })),
    }
  }

  const formattedJson = JSON.stringify(jsonData, null, 2)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(formattedJson)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [formattedJson])

  const SyntaxHighlight = ({ code }: { code: string }) => {
    const highlighted = code
      .replace(/"([^"]+)":/g, '<span style="color:#a855f7">"$1"</span>:')
      .replace(/: "([^"]+)"/g, ': <span style="color:#a3e635">"$1"</span>')
      .replace(/: (\d+)/g, ': <span style="color:#f59e0b">$1</span>')
      .replace(/: (true|false|null)/g, ': <span style="color:#f472b6">$1</span>')
      .replace(/^\s*\[/gm, '<span style="color:#fbbf24">[</span>')
      .replace(/\]\s*$/gm, '<span style="color:#fbbf24">]</span>')
      .replace(/\{/g, '<span style="color:#fbbf24">{</span>')
      .replace(/\}/g, '<span style="color:#fbbf24">}</span>')

    return (
      <div 
        style={{ 
          background: 'var(--bg3)', 
          padding: '14px 16px', 
          fontSize: '10px', 
          fontFamily: 'var(--mono)', 
          color: 'var(--text2)', 
          overflow: 'auto', 
          maxHeight: '300px',
          whiteSpace: 'pre',
          lineHeight: '1.6'
        }}
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    )
  }

  return (
    <div className="panel" style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
      <div className="panel-header" style={{ padding: '11px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}><FileText className="w-3 h-3" /> JSON</div>
        <button 
          onClick={handleCopy}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            padding: '4px 10px', 
            background: copied ? 'var(--green-bg)' : 'transparent', 
            border: `1px solid ${copied ? 'var(--green-bd)' : 'var(--border)'}`, 
            borderRadius: '4px', 
            color: copied ? 'var(--green)' : 'var(--text3)', 
            fontSize: '10px', 
            fontFamily: 'var(--mono)', 
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copiado' : 'Copiar'}
        </button>
      </div>
      <SyntaxHighlight code={formattedJson} />
    </div>
  )
}

const MOCK_DATA: Record<string, any> = {
  'john.doe': {
    query: 'john.doe', type: 'name', icon: 'User',
    sub: 'john.doe · USA · Software Developer',
    confidence: 87, confLabel: 'Alta confianza',
    tags: ['green:Identidad verificada', 'amber:3 filtraciones', 'blue:14 plataformas', 'teal:Presencia alta'],
    metrics: [
      { label: 'Plataformas', value: '14 halladas', color: '' },
      { label: 'Filtraciones', value: '3 detectadas', color: 'var(--red)' },
      { label: 'Emails', value: '4 asociados', color: '' },
      { label: 'Teléfonos', value: '2 encontrados', color: '' },
      { label: 'País', value: 'USA', color: '' },
      { label: 'Riesgo', value: 'Medio', color: 'var(--amber)' },
    ],
    identity: [
      { icon: 'User', key: 'Nombre completo', val: 'John Michael Doe', cls: '' },
      { icon: 'Calendar', key: 'Fecha nacimiento', val: '1989-04-12 (35 años)', cls: '' },
      { icon: 'Globe', key: 'País', val: 'United States', cls: '' },
      { icon: 'MapPin', key: 'Ciudad', val: 'San Francisco, CA', cls: '' },
      { icon: 'Briefcase', key: 'Ocupación', val: 'Software Developer', cls: 'hl' },
      { icon: 'Building', key: 'Empresa', val: 'TechCorp Inc.', cls: '' },
      { icon: 'Link2', key: 'Username principal', val: 'john.doe', cls: 'hl' },
      { icon: 'Clock', key: 'Primera aparición', val: '2010-03-15', cls: '' },
      { icon: 'AlertTriangle', key: 'Nivel de riesgo', val: 'Medio', cls: 'warn' },
    ],
    emails: [
      { addr: 'john.doe@gmail.com', source: 'LinkedIn', confidence: 95, cls: 'green' },
      { addr: 'j.doe@techcorp.com', source: 'GitHub', confidence: 88, cls: 'green' },
      { addr: 'johnd89@hotmail.com', source: 'Breach', confidence: 72, cls: 'amber' },
      { addr: 'john.michael@yahoo.com', source: 'Forum', confidence: 45, cls: 'red' },
    ],
    phones: [
      { num: '+1 (415) 555-0182', source: 'LinkedIn', confidence: 91, cls: 'green' },
      { num: '+1 (415) 555-0847', source: 'Whitepages', confidence: 64, cls: 'amber' },
    ],
    platforms: [
      { name: 'GitHub', handle: '@johndoe', status: 'found', icon: 'Github', bg: '#1a1f2e' },
      { name: 'LinkedIn', handle: 'in/john-doe', status: 'found', icon: 'Linkedin', bg: '#0a1628' },
      { name: 'Twitter/X', handle: '@john_doe', status: 'found', icon: 'Twitter', bg: '#0a0c0e' },
      { name: 'Instagram', handle: '@johndoe89', status: 'found', icon: 'Instagram', bg: '#1a0f1e' },
      { name: 'Reddit', handle: 'u/johndoe_sf', status: 'found', icon: 'MessageCircle', bg: '#1a0f08' },
      { name: 'Facebook', handle: 'john.doe.sf', status: 'private', icon: 'Facebook', bg: '#0a1020' },
      { name: 'YouTube', handle: '@JohnDoeChannel', status: 'found', icon: 'Youtube', bg: '#1a0a0a' },
      { name: 'HackerNews', handle: 'john_doe', status: 'found', icon: 'Hash', bg: '#1a1008' },
      { name: 'Dev.to', handle: '@johndoe', status: 'found', icon: 'Code', bg: '#0a1218' },
      { name: 'Stack Overflow', handle: 'johndoe', status: 'found', icon: 'BookOpen', bg: '#1a1208' },
      { name: 'Telegram', handle: '@johndoe_sf', status: 'found', icon: 'Send', bg: '#081820' },
      { name: 'Discord', handle: 'johndoe#4821', status: 'found', icon: 'Gamepad2', bg: '#0f0a1e' },
      { name: 'TikTok', handle: '@johndoe', status: 'notfound', icon: 'Hash', bg: '#0a0a12' },
      { name: 'Pinterest', handle: '–', status: 'notfound', icon: 'Pin', bg: '#1a0a0a' },
    ],
    breaches: [
      { name: 'LinkedIn Breach 2021', date: '2021-04-09', records: '700M', sev: 'high', sevColor: 'var(--red)', fields: ['email', 'nombre', 'teléfono', 'empresa', 'geolocalización'] },
      { name: 'Adobe Breach 2013', date: '2013-10-03', records: '153M', sev: 'medium', sevColor: 'var(--amber)', fields: ['email', 'contraseña (hash)', 'hint de contraseña'] },
      { name: 'Collection #1', date: '2019-01-07', records: '2.2B', sev: 'high', sevColor: 'var(--red)', fields: ['email', 'contraseña en texto'] },
    ],
    timeline: [
      { type: 'breach', dot: 'leak', icon: 'Unlock', title: 'Filtrado en Collection #1', meta: 'email · contraseña', desc: 'Email john.doe@gmail.com expuesto en mega-dump con 2.2B registros.', date: '2019-01' },
      { type: 'social', dot: 'social', icon: 'Github', title: 'Cuenta GitHub creada', meta: 'john.doe · San Francisco', desc: 'Repositorios públicos: 47 repos, 312 commits en el último año.', date: '2015-06' },
      { type: 'breach', dot: 'leak', icon: 'Unlock', title: 'Filtrado en Adobe Breach', meta: 'email · password hash', desc: 'Datos expuestos en la brecha de Adobe Creative Cloud.', date: '2013-10' },
      { type: 'account', dot: 'account', icon: 'Briefcase', title: 'LinkedIn verificado', meta: 'TechCorp Inc. · San Francisco', desc: 'Perfil activo con 500+ contactos. Empresa y cargo verificados.', date: '2012-03' },
      { type: 'domain', dot: 'domain', icon: 'Globe', title: 'Dominio johndoe.dev registrado', meta: 'Namecheap · johndoe.dev', desc: 'Dominio personal registrado. Actualmente activo con blog técnico.', date: '2020-08' },
      { type: 'alert', dot: 'alert', icon: 'AlertTriangle', title: 'Número de teléfono verificado', meta: '+1 (415) 555-0182', desc: 'Número asociado a LinkedIn y confirmado vía SMS en registros públicos.', date: '2021-11' },
    ],
    connections: [
      { name: 'TechCorp Inc.', type: 'company', icon: 'Building', confidence: 88 },
      { name: 'johndoe.dev', type: 'domain', icon: 'Globe', confidence: 72 },
      { name: 'j.doe@techcorp.com', type: 'email', icon: 'Mail', confidence: 88 },
    ],
  },
  'elon': {
    query: 'elon', type: 'name', icon: 'Rocket',
    sub: 'Elon Musk · USA · CEO / Entrepreneur',
    confidence: 98, confLabel: 'Muy alta confianza',
    tags: ['green:Identidad verificada', 'green:Sin filtraciones', 'blue:18 plataformas', 'teal:Riesgo bajo'],
    metrics: [
      { label: 'Plataformas', value: '18 halladas', color: '' },
      { label: 'Filtraciones', value: '0 detectadas', color: 'var(--green)' },
      { label: 'Emails', value: '2 asociados', color: '' },
      { label: 'Teléfonos', value: '1 encontrado', color: '' },
      { label: 'País', value: 'USA', color: '' },
      { label: 'Riesgo', value: 'Bajo', color: 'var(--green)' },
    ],
    identity: [
      { icon: 'User', key: 'Nombre completo', val: 'Elon Reeve Musk', cls: '' },
      { icon: 'Calendar', key: 'Fecha nacimiento', val: '1971-06-28 (53 años)', cls: '' },
      { icon: 'Globe', key: 'País', val: 'United States', cls: '' },
      { icon: 'MapPin', key: 'Ciudad', val: 'Austin, TX', cls: '' },
      { icon: 'Briefcase', key: 'Ocupación', val: 'CEO / Entrepreneur', cls: 'hl' },
      { icon: 'Building', key: 'Empresa', val: 'Tesla, SpaceX, X Corp', cls: '' },
      { icon: 'Link2', key: 'Username principal', val: 'elonmusk', cls: 'hl' },
      { icon: 'Clock', key: 'Primera aparición', val: '1995-01-01', cls: '' },
      { icon: 'CheckCircle', key: 'Nivel de riesgo', val: 'Bajo', cls: 'good' },
    ],
    emails: [
      { addr: 'elon@tesla.com', source: ' Tesla', confidence: 98, cls: 'green' },
      { addr: 'elon@spacex.com', source: 'SpaceX', confidence: 95, cls: 'green' },
    ],
    phones: [
      { num: '+1 (310) 555-0001', source: 'Public', confidence: 92, cls: 'green' },
    ],
    platforms: [
      { name: 'Twitter/X', handle: '@elonmusk', status: 'found', icon: 'Twitter', bg: '#0a0c0e' },
      { name: 'LinkedIn', handle: 'in/elonmusk', status: 'found', icon: 'Linkedin', bg: '#0a1628' },
      { name: 'Instagram', handle: '@elonmusk', status: 'found', icon: 'Instagram', bg: '#1a0f1e' },
      { name: 'YouTube', handle: '@Tesla', status: 'found', icon: 'Youtube', bg: '#1a0a0a' },
      { name: 'TikTok', handle: '@elonmusk', status: 'found', icon: 'Hash', bg: '#0a0a12' },
      { name: 'Reddit', handle: 'u/elonmusk', status: 'found', icon: 'MessageCircle', bg: '#1a0f08' },
      { name: 'GitHub', handle: '@elonmusk', status: 'found', icon: 'Github', bg: '#1a1f2e' },
      { name: 'Facebook', handle: 'elonmusk', status: 'found', icon: 'Facebook', bg: '#0a1020' },
    ],
    breaches: [],
    timeline: [
      { type: 'account', dot: 'account', icon: 'Briefcase', title: 'CEO de Tesla', meta: '2008-presente', desc: 'Director ejecutivo de Tesla, líder en vehículos eléctricos.', date: '2008-01' },
      { type: 'account', dot: 'account', icon: 'Rocket', title: 'CEO de SpaceX', meta: '2002-presente', desc: 'Fundador y CEO de SpaceX, exploración espacial.', date: '2002-01' },
      { type: 'social', dot: 'social', icon: 'Twitter', title: ' Twitter/X activo', meta: '60M+ seguidores', desc: 'Cuenta más seguida de la plataforma.', date: '2009-06' },
    ],
    connections: [
      { name: 'Tesla', type: 'company', icon: 'Building', confidence: 98 },
      { name: 'SpaceX', type: 'company', icon: 'Rocket', confidence: 98 },
      { name: 'X Corp', type: 'company', icon: 'Twitter', confidence: 95 },
    ],
  },
  'mark': {
    query: 'mark', type: 'name', icon: 'User',
    sub: 'Mark Zuckerberg · USA · CEO Meta',
    confidence: 99, confLabel: 'Muy alta confianza',
    tags: ['green:Identidad verificada', 'green:Sin filtraciones', 'blue:12 plataformas', 'teal:Riesgo bajo'],
    metrics: [
      { label: 'Plataformas', value: '12 halladas', color: '' },
      { label: 'Filtraciones', value: '0 detectadas', color: 'var(--green)' },
      { label: 'Emails', value: '1 asociado', color: '' },
      { label: 'Teléfonos', value: '1 encontrado', color: '' },
      { label: 'País', value: 'USA', color: '' },
      { label: 'Riesgo', value: 'Bajo', color: 'var(--green)' },
    ],
    identity: [
      { icon: 'User', key: 'Nombre completo', val: 'Mark Elliot Zuckerberg', cls: '' },
      { icon: 'Calendar', key: 'Fecha nacimiento', val: '1984-05-14 (40 años)', cls: '' },
      { icon: 'Globe', key: 'País', val: 'United States', cls: '' },
      { icon: 'MapPin', key: 'Ciudad', val: 'Palo Alto, CA', cls: '' },
      { icon: 'Briefcase', key: 'Ocupación', val: 'CEO / Founder', cls: 'hl' },
      { icon: 'Building', key: 'Empresa', val: 'Meta Platforms', cls: '' },
      { icon: 'Link2', key: 'Username principal', val: 'zuck', cls: 'hl' },
      { icon: 'Clock', key: 'Primera aparición', val: '2004-02-04', cls: '' },
      { icon: 'CheckCircle', key: 'Nivel de riesgo', val: 'Bajo', cls: 'good' },
    ],
    emails: [
      { addr: 'mark@meta.com', source: 'Meta', confidence: 99, cls: 'green' },
    ],
    platforms: [
      { name: 'Facebook', handle: 'zuck', status: 'found', icon: 'Facebook', bg: '#0a1020' },
      { name: 'LinkedIn', handle: 'in/markzuckerberg', status: 'found', icon: 'Linkedin', bg: '#0a1628' },
      { name: 'Instagram', handle: '@zuck', status: 'found', icon: 'Instagram', bg: '#1a0f1e' },
      { name: 'Twitter/X', handle: '@finkd', status: 'found', icon: 'Twitter', bg: '#0a0c0e' },
    ],
    breaches: [],
    timeline: [
      { type: 'account', dot: 'account', icon: 'Facebook', title: 'Facebook fundado', meta: '2004-presente', desc: 'Fundador y CEO de Meta Platforms.', date: '2004-02' },
    ],
    connections: [
      { name: 'Meta', type: 'company', icon: 'Facebook', confidence: 99 },
    ],
  },
}

export default function PersonasPage() {
  const [query, setQuery] = useState('')
  const [queryType, setQueryType] = useState('name')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('resumen')

  const loadExample = (key: string, type: string = 'name') => {
    setQuery(key)
    setQueryType(type)
    setTimeout(() => {
      setLoading(true)
      setTimeout(() => {
        setResult(MOCK_DATA[key] || { query: key, type: type, confidence: 0, identity: [], emails: [], phones: [], platforms: [], breaches: [], timeline: [], connections: [] })
        setLoading(false)
      }, 800)
    }, 100)
  }

  const runSearch = async () => {
    if (!query) return
    setLoading(true)
    setTimeout(() => {
      const key = Object.keys(MOCK_DATA).find(k => query.toLowerCase().includes(k.replace('.', '')))
      setResult(MOCK_DATA[key] || { query, type: queryType, confidence: 0, identity: [], emails: [], phones: [], platforms: [], breaches: [], timeline: [], connections: [] })
      setLoading(false)
    }, 1500)
  }

  const getConfidenceColor = (conf: number) => {
    if (conf >= 80) return 'var(--green)'
    if (conf >= 60) return 'var(--amber)'
    return 'var(--red)'
  }

  const getTagColor = (color: string) => {
    switch (color) {
      case 'green': return { bg: 'var(--green-bg)', color: 'var(--green)', border: 'var(--green-bd)' }
      case 'amber': return { bg: 'var(--amber-bg)', color: 'var(--amber)', border: 'var(--amber-bd)' }
      case 'red': return { bg: 'var(--red-bg)', color: 'var(--red)', border: 'var(--red-bd)' }
      case 'blue': return { bg: 'var(--blue-bg)', color: 'var(--blue)', border: 'var(--blue-bd)' }
      case 'teal': return { bg: 'var(--teal-bg)', color: 'var(--teal)', border: 'var(--teal-bd)' }
      default: return { bg: 'var(--bg3)', color: 'var(--text2)', border: 'var(--border)' }
    }
  }

  const confCirc = 170
  const confOffset = result ? confCirc - (result.confidence / 100) * confCirc : confCirc

  const renderIconInline = (iconName: string) => {
    const IconComp = iconComponents[iconName]
    if (!IconComp) return <User className="w-3 h-3" />
    return <IconComp className="w-3 h-3" />
  }

  const renderPlatformIconInline = (iconName: string) => {
    const IconComp = platformIconComponents[iconName]
    if (!IconComp) return <User className="w-3 h-3" />
    return <IconComp className="w-3 h-3" />
  }

  return (
    <div className="space-y-4">
      <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.04)] rounded-lg p-4 flex items-center gap-4">
        <div className="text-[#666] text-sm font-mono">Herramientas</div>
        <span className="text-[#666]">/</span>
        <div className="text-[var(--green)] text-sm font-mono">Personas</div>
        <div className="flex-1 flex gap-3">
          <input
            type="text"
            placeholder="Nombre, email, teléfono, username..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && runSearch()}
            className="flex-1 max-w-md bg-[#111] border border-[rgba(255,255,255,0.08)] rounded-lg px-4 py-2 text-white placeholder-[#666] font-mono text-sm focus:border-[var(--green)] focus:outline-none"
          />
          <select
            value={queryType}
            onChange={(e) => setQueryType(e.target.value)}
            className="bg-[#111] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2 text-white font-mono text-sm"
          >
            <option value="name">Nombre</option>
            <option value="email">Email</option>
            <option value="phone">Teléfono</option>
            <option value="username">Username</option>
            <option value="domain">Dominio</option>
          </select>
          <button onClick={runSearch} disabled={loading || !query} style={{ height: '32px', padding: '0 16px', background: 'var(--green)', border: 'none', borderRadius: '6px', color: '#0a0c0e', fontSize: '12px', fontWeight: 600, cursor: 'pointer', opacity: loading || !query ? 0.4 : 1 }}>
            {loading ? 'Buscando...' : 'BUSCAR'}
          </button>
        </div>
      </div>

      <div className={`loading-bar ${loading ? 'active' : ''}`} style={{ background: 'var(--green)' }}>
        <div className="loading-fill" style={{ background: 'var(--green)' }}></div>
      </div>

      {!result && !loading && (
        <div className="empty-state">
          <div className="empty-icon" style={{ background: 'var(--green-bg)', border: '1px solid var(--green-bd)' }}>
            <User className="w-6 h-6" style={{ color: 'var(--green)' }} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text)' }}>Módulo Personas · OSINT</div>
            <div style={{ fontSize: '12px', fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: '5px' }}>Perfilado completo: identidad, contactos, presencia digital y filtraciones</div>
          </div>
          <div className="empty-grid">
            <div className="empty-card" onClick={() => loadExample('john.doe', 'name')} style={{ borderColor: 'var(--green-bd)' }}>
              <div className="empty-card-title" style={{ color: 'var(--green)' }}><User className="w-3 h-3 inline mr-1" /> John Doe</div>
              <div className="empty-card-sub">USA · Developer</div>
            </div>
            <div className="empty-card" onClick={() => loadExample('elon', 'name')} style={{ borderColor: 'var(--green-bd)' }}>
              <div className="empty-card-title" style={{ color: 'var(--green)' }}><Rocket className="w-3 h-3 inline mr-1" /> Elon Musk</div>
              <div className="empty-card-sub">USA · CEO</div>
            </div>
            <div className="empty-card" onClick={() => loadExample('mark', 'name')} style={{ borderColor: 'var(--green-bd)' }}>
              <div className="empty-card-title" style={{ color: 'var(--green)' }}><User className="w-3 h-3 inline mr-1" /> Mark Zuckerberg</div>
              <div className="empty-card-sub">USA · CEO Meta</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', maxWidth: '620px', width: '100%' }}>
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '8px', padding: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--green)', fontFamily: 'var(--mono)' }}>100+</div>
              <div style={{ fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: '4px' }}>plataformas</div>
            </div>
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '8px', padding: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--amber)', fontFamily: 'var(--mono)' }}>12,847</div>
              <div style={{ fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: '4px' }}>filtraciones</div>
            </div>
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '8px', padding: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--blue)', fontFamily: 'var(--mono)' }}>14.5B</div>
              <div style={{ fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: '4px' }}>registros</div>
            </div>
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '8px', padding: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--teal)', fontFamily: 'var(--mono)' }}>AI</div>
              <div style={{ fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: '4px' }}>reconocimiento</div>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="result visible">
          <div className="persona-header">
            <div className="persona-header-inner">
              <div className="persona-avatar" style={{ background: 'var(--green-bg)', border: '1px solid var(--green-bd)' }}>
                {renderIconInline(result.icon)}
              </div>
              <div className="persona-main">
                <div className="persona-name">{result.query}</div>
                <div className="persona-sub">{result.sub}</div>
                <div className="persona-tags" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {result.tags?.map((tag: string, i: number) => {
                    const [color, text] = tag.split(':')
                    const colors = getTagColor(color)
                    return (
                      <span key={i} className="tag" style={{ background: colors.bg, color: colors.color, border: `1px solid ${colors.border}` }}>
                        {text}
                      </span>
                    )
                  })}
                </div>
              </div>
              <div className="confidence-wrap">
                <div className="confidence-label">Confianza</div>
                <div className="confidence-ring-wrap" style={{ width: '64px', height: '64px' }}>
                  <svg width="64" height="64" viewBox="0 0 64 64" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="32" cy="32" r="27" fill="none" stroke="var(--border)" strokeWidth="5" />
                    <circle cx="32" cy="32" r="27" fill="none" stroke={getConfidenceColor(result.confidence)} strokeWidth="5" strokeLinecap="round" strokeDasharray="170" strokeDashoffset={confOffset} style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
                  </svg>
                  <span className="confidence-num" style={{ color: getConfidenceColor(result.confidence) }}>{result.confidence}%</span>
                </div>
                <div className="confidence-sub" style={{ color: getConfidenceColor(result.confidence) }}>{result.confLabel}</div>
              </div>
            </div>
            <div className="persona-metrics" style={{ display: 'flex', borderTop: '1px solid var(--border)' }}>
              {result.metrics?.map((m: any, i: number) => (
                <div key={i} style={{ flex: 1, padding: '11px 16px', borderRight: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '9px', fontFamily: 'var(--mono)', color: 'var(--text3)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '3px' }}>{m.label}</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: m.color || 'var(--text)' }}>{m.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="main-grid" style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '16px' }}>
            <div className="left-col" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="panel" style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
                <div className="panel-header" style={{ padding: '11px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}><User className="w-3 h-3" /> Identidad</div>
                </div>
                <div className="identity-rows" style={{ display: 'flex', flexDirection: 'column' }}>
                  {result.identity?.map((r: any, i: number) => (
                    <div key={i} className="irow" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 16px', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '14px', flexShrink: 0 }}>{renderIconInline(r.icon)}</span>
                      <span style={{ fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--text3)', minWidth: '100px' }}>{r.key}</span>
                      <span style={{ fontSize: '11px', fontFamily: 'var(--mono)', color: r.cls === 'hl' ? 'var(--green)' : r.cls === 'warn' ? 'var(--amber)' : r.cls === 'good' ? 'var(--green)' : r.cls === 'bad' ? 'var(--red)' : 'var(--text2)', flex: 1 }}>{r.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel" style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
                <div className="panel-header" style={{ padding: '11px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}><Mail className="w-3 h-3" /> Contacto</div>
                  <span style={{ fontSize: '10px', fontFamily: 'var(--mono)', padding: '1px 6px', borderRadius: '2px', background: 'var(--green-bg)', color: 'var(--green)', border: '1px solid var(--green-bd)' }}>{result.emails?.length + result.phones?.length}</span>
                </div>
                <div className="tabs" style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
                  <button className={`tab ${activeTab === 'resumen' ? 'active' : ''}`} onClick={() => setActiveTab('resumen')} style={{ color: activeTab === 'resumen' ? 'var(--green)' : '', padding: '10px 16px', fontSize: '12px', cursor: 'pointer', borderBottom: activeTab === 'resumen' ? '2px solid var(--green)' : 'none' }}>Emails</button>
                  <button className={`tab ${activeTab === 'plataformas' ? 'active' : ''}`} onClick={() => setActiveTab('plataformas')} style={{ color: activeTab === 'plataformas' ? 'var(--green)' : '', padding: '10px 16px', fontSize: '12px', cursor: 'pointer', borderBottom: activeTab === 'plataformas' ? '2px solid var(--green)' : 'none' }}>Teléfonos</button>
                </div>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {activeTab === 'resumen' && (
                    <div className="contact-list" style={{ display: 'flex', flexDirection: 'column' }}>
                      {result.emails?.length > 0 ? result.emails.map((e: any, i: number) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', borderBottom: '1px solid var(--border)' }}>
                          <Mail className="w-3 h-3" style={{ fontSize: '14px' }} />
                          <span style={{ fontSize: '11px', fontFamily: 'var(--mono)', color: 'var(--text)', flex: 1 }}>{e.addr}</span>
                          <span style={{ fontSize: '9px', fontFamily: 'var(--mono)', color: 'var(--text3)' }}>{e.source}</span>
                          <span style={{ fontSize: '9px', fontFamily: 'var(--mono)', padding: '1px 6px', borderRadius: '2px', background: e.cls === 'green' ? 'var(--green-bg)' : e.cls === 'amber' ? 'var(--amber-bg)' : 'var(--red-bg)', color: e.cls === 'green' ? 'var(--green)' : e.cls === 'amber' ? 'var(--amber)' : 'var(--red)', border: `1px solid ${e.cls === 'green' ? 'var(--green-bd)' : e.cls === 'amber' ? 'var(--amber-bd)' : 'var(--red-bd)'}` }}>{e.confidence}%</span>
                        </div>
                      )) : (
                        <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text3)', fontSize: '11px', fontFamily: 'var(--mono)' }}>No se encontraron emails</div>
                      )}
                    </div>
                  )}
                  {activeTab === 'plataformas' && (
                    <div className="contact-list" style={{ display: 'flex', flexDirection: 'column' }}>
                      {result.phones?.length > 0 ? result.phones.map((p: any, i: number) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', borderBottom: '1px solid var(--border)' }}>
                          <Phone className="w-3 h-3" style={{ fontSize: '14px' }} />
                          <span style={{ fontSize: '11px', fontFamily: 'var(--mono)', color: 'var(--text)', flex: 1 }}>{p.num}</span>
                          <span style={{ fontSize: '9px', fontFamily: 'var(--mono)', color: 'var(--text3)' }}>{p.source}</span>
                          <span style={{ fontSize: '9px', fontFamily: 'var(--mono)', padding: '1px 6px', borderRadius: '2px', background: p.cls === 'green' ? 'var(--green-bg)' : 'var(--amber-bg)', color: p.cls === 'green' ? 'var(--green)' : 'var(--amber)', border: `1px solid ${p.cls === 'green' ? 'var(--green-bd)' : 'var(--amber-bd)'}` }}>{p.confidence}%</span>
                        </div>
                      )) : (
                        <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text3)', fontSize: '11px', fontFamily: 'var(--mono)' }}>No se encontraron teléfonos</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="panel" style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
                <div className="panel-header" style={{ padding: '11px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}><Link2 className="w-3 h-3" /> Grafo de relaciones</div>
                </div>
                <RelationshipGraph data={result} />
              </div>
            </div>

            <div className="right-col" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="panel" style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
                <div className="panel-header" style={{ padding: '11px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}><Globe className="w-3 h-3" /> Presencia digital</div>
                  <span style={{ fontSize: '10px', fontFamily: 'var(--mono)', padding: '1px 6px', borderRadius: '2px', background: 'var(--green-bg)', color: 'var(--green)', border: '1px solid var(--green-bd)' }}>{result.platforms?.filter((p: any) => p.status === 'found').length}</span>
                </div>
                <div className="tabs" style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
                  <button className="tab active" style={{ padding: '10px 16px', fontSize: '12px', color: 'var(--green)', borderBottom: '2px solid var(--green)' }}>Todas</button>
                </div>
                <div className="platforms-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>
                  {result.platforms?.map((p: any, i: number) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderBottom: '1px solid var(--border)', borderRight: i % 2 === 0 ? '1px solid var(--border)' : 'none', opacity: p.status === 'notfound' ? 0.5 : 1 }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>{renderPlatformIconInline(p.icon)}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text)', marginBottom: '1px' }}>{p.name}</div>
                        <div style={{ fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--text3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.handle}</div>
                      </div>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: p.status === 'found' ? 'var(--green)' : p.status === 'private' ? 'var(--amber)' : 'var(--text3)', boxShadow: p.status !== 'notfound' ? `0 0 5px ${p.status === 'found' ? 'var(--green)' : 'var(--amber)'}` : 'none' }}></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel" style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
                <div className="panel-header" style={{ padding: '11px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}><Lock className="w-3 h-3" /> Filtraciones de datos</div>
                  <span style={{ fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--text3)' }}>{result.breaches?.length === 0 ? 'Sin exposición' : `${result.breaches?.length} total`}</span>
                </div>
                <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                  {result.breaches?.length > 0 ? (
                    result.breaches.map((b: any, i: number) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 16px', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: b.sevColor, boxShadow: `0 0 6px ${b.sevColor}`, flexShrink: 0 }}></div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text)', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {b.name}
                            <span style={{ fontSize: '9px', fontFamily: 'var(--mono)', padding: '2px 6px', borderRadius: '2px', background: 'var(--bg3)', color: 'var(--text3)', border: '1px solid var(--border)' }}>{b.sev.toUpperCase()}</span>
                          </div>
                          <div style={{ fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--text3)' }}>{b.records} registros · {b.date}</div>
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '4px' }}>
                            {b.fields?.map((f: string, j: number) => (
                              <span key={j} style={{ fontSize: '9px', fontFamily: 'var(--mono)', padding: '1px 5px', borderRadius: '2px', background: 'var(--bg3)', color: 'var(--text3)', border: '1px solid var(--border)' }}>{f}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                      <CheckCircle className="w-6 h-6" style={{ marginBottom: '12px', color: 'var(--green)' }} />
                      <div style={{ fontSize: '14px', color: 'var(--green)' }}>Sin filtraciones detectadas</div>
                      <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '8px' }}>Escaneado en 800+ fuentes</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="panel" style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
                <div className="panel-header" style={{ padding: '11px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}><Clock className="w-3 h-3" /> Actividad histórica</div>
                </div>
                <div className="timeline" style={{ display: 'flex', flexDirection: 'column', padding: '14px 16px', gap: '0', maxHeight: '280px', overflowY: 'auto' }}>
                  {result.timeline?.map((t: any, i: number) => (
                    <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', paddingBottom: '16px', position: 'relative' }}>
                      <div style={{ width: '29px', height: '29px', borderRadius: '50%', background: t.dot === 'leak' ? 'var(--red-bg)' : t.dot === 'social' ? 'var(--blue-bg)' : t.dot === 'account' ? 'var(--green-bg)' : 'var(--amber-bg)', border: `1px solid ${t.dot === 'leak' ? 'var(--red)' : t.dot === 'social' ? 'var(--blue)' : t.dot === 'account' ? 'var(--green)' : 'var(--amber)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', flexShrink: 0 }}>
                        {renderIconInline(t.icon)}
                      </div>
                      <div style={{ flex: 1, paddingTop: '4px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text)', marginBottom: '2px' }}>{t.title}</div>
                        <div style={{ fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: '3px' }}>{t.meta}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text3)', lineHeight: '1.5' }}>{t.desc}</div>
                      </div>
                      <div style={{ fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--text3)', whiteSpace: 'nowrap', flexShrink: 0, paddingTop: '6px' }}>{t.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <JsonPanel data={result} />
        </div>
      )}
    </div>
  )
}