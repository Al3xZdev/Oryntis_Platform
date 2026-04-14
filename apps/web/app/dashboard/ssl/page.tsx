'use client'

import { useState } from 'react'
import { Shield, Lock, AlertTriangle, Clock, Download, Copy, ChevronDown } from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────
interface Protocol {
  name: string
  status: 'ok' | 'warn' | 'bad'
  label: string
}

interface Cipher {
  name: string
  proto: string
  bits: number
  strength: 'strong' | 'weak'
}

interface Vuln {
  name: string
  sev: 'critical' | 'high' | 'low' | 'info'
  icon: string
  desc: string
}

interface ChainItem {
  type: 'root' | 'inter' | 'leaf'
  cn: string
  org: string
  tag: string
  tagClass: 'teal' | 'blue' | 'green' | 'red'
}

interface HttpHeader {
  name: string
  val: string
  status: 'ok' | 'warn' | 'bad'
}

interface SSLResult {
  domain: string
  port: number
  status: 'valid' | 'warn' | 'invalid'
  score: number
  grade: string
  subject: { cn: string; org: string; country: string }
  issuer: { cn: string; org: string; country: string }
  notBefore: string
  notAfter: string
  daysLeft: number
  sans: string[]
  keyAlg: string
  keyBits: number
  sigAlg: string
  serial: string
  fingerprint: string
  bestProtocol: string
  protocols: Protocol[]
  ciphers: Cipher[]
  vulns: Vuln[]
  chain: ChainItem[]
  httpHeaders: HttpHeader[]
}

// ── Mock Data ──────────────────────────────────────────────────────
const MOCKS: Record<string, SSLResult> = {
  'github.com': {
    domain: 'github.com', port: 443,
    status: 'valid', score: 96, grade: 'A+',
    subject: { cn: 'github.com', org: 'GitHub, Inc.', country: 'US' },
    issuer: { cn: 'DigiCert TLS Hybrid ECC SHA384 2020 CA1', org: 'DigiCert Inc.', country: 'US' },
    notBefore: '2024-03-07', notAfter: '2025-03-08',
    daysLeft: 148, sans: ['github.com', 'www.github.com', '*.github.com', '*.githubusercontent.com', 'github.io', '*.github.io'],
    keyAlg: 'ECDSA', keyBits: 384, sigAlg: 'SHA384withECDSA',
    serial: '0D:3E:45:78:A2:C1:BB:F8:91:44:63:D1:20:E5:08:9A',
    fingerprint: 'SHA-256: 4A:8B:C2:D1:...',
    bestProtocol: 'TLS 1.3',
    protocols: [
      { name: 'TLS 1.3', status: 'ok', label: 'Habilitado' },
      { name: 'TLS 1.2', status: 'ok', label: 'Habilitado' },
      { name: 'TLS 1.1', status: 'bad', label: 'Desactivado' },
      { name: 'TLS 1.0', status: 'bad', label: 'Desactivado' },
      { name: 'SSL 3.0', status: 'bad', label: 'Desactivado' },
      { name: 'SSL 2.0', status: 'bad', label: 'Desactivado' },
    ],
    ciphers: [
      { name: 'TLS_AES_256_GCM_SHA384', proto: 'TLS 1.3', bits: 256, strength: 'strong' },
      { name: 'TLS_CHACHA20_POLY1305_SHA256', proto: 'TLS 1.3', bits: 256, strength: 'strong' },
      { name: 'TLS_AES_128_GCM_SHA256', proto: 'TLS 1.3', bits: 128, strength: 'strong' },
      { name: 'ECDHE-ECDSA-AES256-GCM-SHA384', proto: 'TLS 1.2', bits: 256, strength: 'strong' },
      { name: 'ECDHE-ECDSA-AES128-GCM-SHA256', proto: 'TLS 1.2', bits: 128, strength: 'strong' },
      { name: 'ECDHE-ECDSA-CHACHA20-POLY1305', proto: 'TLS 1.2', bits: 256, strength: 'strong' },
    ],
    vulns: [
      { name: 'BEAST', sev: 'low', icon: '✓', desc: 'No vulnerable. TLS 1.0 deshabilitado.' },
      { name: 'POODLE', sev: 'low', icon: '✓', desc: 'No vulnerable. SSL 3.0 deshabilitado.' },
      { name: 'HEARTBLEED', sev: 'low', icon: '✓', desc: 'No vulnerable. OpenSSL parchado.' },
      { name: 'CRIME/BREACH', sev: 'low', icon: '✓', desc: 'Compresión TLS deshabilitada.' },
      { name: 'ROBOT', sev: 'low', icon: '✓', desc: 'RSA no utilizado para intercambio de claves.' },
    ],
    chain: [
      { type: 'root', cn: 'DigiCert Global Root CA', org: 'DigiCert Inc.', tag: 'Root CA', tagClass: 'teal' },
      { type: 'inter', cn: 'DigiCert TLS Hybrid ECC SHA384 2020 CA1', org: 'DigiCert Inc.', tag: 'Intermedio', tagClass: 'blue' },
      { type: 'leaf', cn: 'github.com', org: 'GitHub, Inc.', tag: 'Certificado leaf', tagClass: 'green' },
    ],
    httpHeaders: [
      { name: 'HSTS', val: 'max-age=31536000; includeSubDomains; preload', status: 'ok' },
      { name: 'X-Frame-Options', val: 'deny', status: 'ok' },
      { name: 'X-Content-Type', val: 'nosniff', status: 'ok' },
      { name: 'CSP', val: 'default-src \'self\'…', status: 'ok' },
      { name: 'Referrer-Policy', val: 'strict-origin-when-cross', status: 'ok' },
      { name: 'Permissions-Policy', val: 'interest-cohort=()', status: 'ok' },
    ],
  },

  'expired.badssl.com': {
    domain: 'expired.badssl.com', port: 443,
    status: 'invalid', score: 14, grade: 'F',
    subject: { cn: '*.badssl.com', org: 'BadSSL', country: 'US' },
    issuer: { cn: 'COMODO RSA Domain Validation Secure Server CA', org: 'COMODO CA Limited', country: 'GB' },
    notBefore: '2015-04-09', notAfter: '2015-04-12',
    daysLeft: -3283, sans: ['*.badssl.com', 'badssl.com'],
    keyAlg: 'RSA', keyBits: 2048, sigAlg: 'SHA256withRSA',
    serial: '4A:E7:95:49:FA:9A:BE:3F:10:0F:17:A4:78:E1:69:09',
    fingerprint: 'SHA-256: BA:88:CA:03:...',
    bestProtocol: 'TLS 1.2',
    protocols: [
      { name: 'TLS 1.3', status: 'bad', label: 'No soportado' },
      { name: 'TLS 1.2', status: 'warn', label: 'Habilitado' },
      { name: 'TLS 1.1', status: 'warn', label: 'Habilitado' },
      { name: 'TLS 1.0', status: 'warn', label: 'Habilitado' },
      { name: 'SSL 3.0', status: 'bad', label: 'Desactivado' },
      { name: 'SSL 2.0', status: 'bad', label: 'Desactivado' },
    ],
    ciphers: [
      { name: 'ECDHE-RSA-AES256-GCM-SHA384', proto: 'TLS 1.2', bits: 256, strength: 'strong' },
      { name: 'AES256-SHA', proto: 'TLS 1.1', bits: 256, strength: 'weak' },
      { name: 'DES-CBC3-SHA', proto: 'TLS 1.0', bits: 112, strength: 'weak' },
      { name: 'RC4-SHA', proto: 'TLS 1.0', bits: 128, strength: 'weak' },
    ],
    vulns: [
      { name: 'CERTIFICADO EXPIRADO', sev: 'critical', icon: '🔴', desc: 'El certificado venció el 12 de abril de 2015 (hace más de 3 años).' },
      { name: 'BEAST', sev: 'high', icon: '⚠️', desc: 'Vulnerable. TLS 1.0 habilitado con ciphers CBC.' },
      { name: 'POODLE', sev: 'low', icon: '✓', desc: 'No vulnerable a POODLE. SSL 3.0 deshabilitado.' },
      { name: 'WEAK CIPHERS', sev: 'high', icon: '⚠️', desc: 'RC4 y DES-CBC3 habilitados. Deben desactivarse.' },
    ],
    chain: [
      { type: 'root', cn: 'AddTrust External CA Root', org: 'AddTrust AB', tag: 'Root CA', tagClass: 'teal' },
      { type: 'inter', cn: 'COMODO RSA Certification Authority', org: 'COMODO CA Limited', tag: 'Intermedio', tagClass: 'blue' },
      { type: 'inter', cn: 'COMODO RSA Domain Validation Secure Server CA', org: 'COMODO CA Limited', tag: 'Intermedio', tagClass: 'blue' },
      { type: 'leaf', cn: '*.badssl.com', org: 'BadSSL', tag: 'EXPIRADO', tagClass: 'red' },
    ],
    httpHeaders: [
      { name: 'HSTS', val: 'No configurado', status: 'bad' },
      { name: 'X-Frame-Options', val: 'No configurado', status: 'bad' },
      { name: 'X-Content-Type', val: 'No configurado', status: 'bad' },
      { name: 'CSP', val: 'No configurado', status: 'bad' },
      { name: 'Referrer-Policy', val: 'No configurado', status: 'bad' },
      { name: 'Permissions-Policy', val: 'No configurado', status: 'bad' },
    ],
  },

  'google.com': {
    domain: 'google.com', port: 443,
    status: 'valid', score: 92, grade: 'A',
    subject: { cn: '*.google.com', org: 'Google LLC', country: 'US' },
    issuer: { cn: 'GTS CA 1C3', org: 'Google Trust Services LLC', country: 'US' },
    notBefore: '2025-02-24', notAfter: '2025-05-19',
    daysLeft: 37, sans: ['*.google.com', 'google.com', '*.googleapis.com', '*.gstatic.com'],
    keyAlg: 'ECDSA', keyBits: 256, sigAlg: 'SHA256withECDSA',
    serial: '6F:AB:00:3D:84:51:DC:9B:C2:7A:F9:11:E3:9B:C2:56',
    fingerprint: 'SHA-256: 7C:2B:A1:F3:...',
    bestProtocol: 'TLS 1.3',
    protocols: [
      { name: 'TLS 1.3', status: 'ok', label: 'Habilitado' },
      { name: 'TLS 1.2', status: 'ok', label: 'Habilitado' },
      { name: 'TLS 1.1', status: 'bad', label: 'Desactivado' },
      { name: 'TLS 1.0', status: 'bad', label: 'Desactivado' },
      { name: 'SSL 3.0', status: 'bad', label: 'Desactivado' },
      { name: 'SSL 2.0', status: 'bad', label: 'Desactivado' },
    ],
    ciphers: [
      { name: 'TLS_AES_256_GCM_SHA384', proto: 'TLS 1.3', bits: 256, strength: 'strong' },
      { name: 'TLS_CHACHA20_POLY1305_SHA256', proto: 'TLS 1.3', bits: 256, strength: 'strong' },
      { name: 'ECDHE-ECDSA-AES128-GCM-SHA256', proto: 'TLS 1.2', bits: 128, strength: 'strong' },
    ],
    vulns: [
      { name: 'BEAST', sev: 'low', icon: '✓', desc: 'No vulnerable.' },
      { name: 'POODLE', sev: 'low', icon: '✓', desc: 'No vulnerable.' },
      { name: 'HEARTBLEED', sev: 'low', icon: '✓', desc: 'No vulnerable.' },
      { name: 'ROBOT', sev: 'low', icon: '✓', desc: 'No vulnerable.' },
    ],
    chain: [
      { type: 'root', cn: 'GTS Root R1', org: 'Google Trust Services LLC', tag: 'Root CA', tagClass: 'teal' },
      { type: 'inter', cn: 'GTS CA 1C3', org: 'Google Trust Services LLC', tag: 'Intermedio', tagClass: 'blue' },
      { type: 'leaf', cn: '*.google.com', org: 'Google LLC', tag: 'Certificado leaf', tagClass: 'green' },
    ],
    httpHeaders: [
      { name: 'HSTS', val: 'max-age=31536000', status: 'ok' },
      { name: 'X-Frame-Options', val: 'SAMEORIGIN', status: 'ok' },
      { name: 'X-Content-Type', val: 'nosniff', status: 'ok' },
      { name: 'CSP', val: 'Parcial', status: 'warn' },
      { name: 'Referrer-Policy', val: 'strict-origin', status: 'ok' },
      { name: 'Permissions-Policy', val: 'No configurado', status: 'bad' },
    ],
  },

  'self-signed.badssl.com': {
    domain: 'self-signed.badssl.com', port: 443,
    status: 'warn', score: 45, grade: 'C',
    subject: { cn: 'self-signed.badssl.com', org: 'BadSSL', country: 'US' },
    issuer: { cn: 'self-signed.badssl.com', org: 'BadSSL', country: 'US' },
    notBefore: '2024-01-01', notAfter: '2026-01-01',
    daysLeft: 280, sans: ['self-signed.badssl.com'],
    keyAlg: 'RSA', keyBits: 2048, sigAlg: 'SHA256withRSA',
    serial: '1A:2B:3C:4D:5E:6F:7A:8B',
    fingerprint: 'SHA-256: CD:EF:12:34:...',
    bestProtocol: 'TLS 1.2',
    protocols: [
      { name: 'TLS 1.3', status: 'bad', label: 'No soportado' },
      { name: 'TLS 1.2', status: 'ok', label: 'Habilitado' },
      { name: 'TLS 1.1', status: 'bad', label: 'Desactivado' },
      { name: 'TLS 1.0', status: 'bad', label: 'Desactivado' },
      { name: 'SSL 3.0', status: 'bad', label: 'Desactivado' },
      { name: 'SSL 2.0', status: 'bad', label: 'Desactivado' },
    ],
    ciphers: [
      { name: 'ECDHE-RSA-AES256-GCM-SHA384', proto: 'TLS 1.2', bits: 256, strength: 'strong' },
      { name: 'ECDHE-RSA-AES128-GCM-SHA256', proto: 'TLS 1.2', bits: 128, strength: 'strong' },
    ],
    vulns: [
      { name: 'AUTOFIRMADO', sev: 'high', icon: '⚠️', desc: 'El certificado está autofirmado. No es confiable para producción.' },
      { name: 'BEAST', sev: 'low', icon: '✓', desc: 'No vulnerable. TLS 1.0 deshabilitado.' },
      { name: 'POODLE', sev: 'low', icon: '✓', desc: 'No vulnerable. SSL 3.0 deshabilitado.' },
    ],
    chain: [
      { type: 'leaf', cn: 'self-signed.badssl.com', org: 'BadSSL', tag: 'Autofirmado', tagClass: 'red' },
    ],
    httpHeaders: [
      { name: 'HSTS', val: 'No configurado', status: 'bad' },
      { name: 'X-Frame-Options', val: 'No configurado', status: 'bad' },
      { name: 'X-Content-Type', val: 'nosniff', status: 'ok' },
      { name: 'CSP', val: 'No configurado', status: 'bad' },
      { name: 'Referrer-Policy', val: 'No configurado', status: 'bad' },
      { name: 'Permissions-Policy', val: 'No configurado', status: 'bad' },
    ],
  },
}

const EXAMPLES = ['github.com', 'expired.badssl.com', 'self-signed.badssl.com', 'google.com']

// ── Helpers ────────────────────────────────────────────────────────
function daysBetween(a: string, b: string): number {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000)
}

function scoreColor(s: number): string {
  if (s >= 80) return 'var(--green)'
  if (s >= 50) return 'var(--amber)'
  return 'var(--red)'
}

function scoreColorClass(s: number): string {
  if (s >= 80) return 'text-[#00ff41]'
  if (s >= 50) return 'text-[#ffd700]'
  return 'text-[#ff3333]'
}

function getMock(host: string): SSLResult {
  const found = Object.keys(MOCKS).find(k => host.includes(k.split('.')[0]))
  const m = found ? JSON.parse(JSON.stringify(MOCKS[found])) : JSON.parse(JSON.stringify(MOCKS['github.com']))
  m.domain = host
  return m
}

// ── Sub-components ─────────────────────────────────────────────────

function StatusBadge({ status, text }: { status: string; text: string }) {
  const cls = status === 'valid' ? 'safe' : status === 'warn' ? 'warn' : 'danger'
  return (
    <span className={`status-badge ${cls}`}>
      <span className="s-dot"></span>
      {text}
    </span>
  )
}

function SevBadge({ sev }: { sev: string }) {
  const cls = sev === 'critical' ? 'danger' : sev === 'high' ? 'warn' : sev === 'low' ? 'safe' : 'info'
  return <span className={`pill ${cls}`}>{sev.toUpperCase()}</span>
}

function ChainDot({ type }: { type: string }) {
  const cls = type === 'root' ? 'root' : type === 'inter' ? 'inter' : 'leaf'
  const borderCls = type === 'root' ? 'border-[var(--green-bd)] bg-[var(--green-bg)]' : type === 'inter' ? 'border-[var(--blue-bd)] bg-[var(--blue-bg)]' : 'border-[var(--green-bd)] bg-[var(--green-bg)]'
  const icon = type === 'root' ? '🔐' : type === 'inter' ? '🔗' : '📄'
  return (
    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 border ${borderCls}`}>
      {icon}
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────
export default function SslPage() {
  const [host, setHost] = useState('')
  const [port, setPort] = useState('443')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SSLResult | null>(null)
  const [certTab, setCertTab] = useState<'details' | 'san' | 'raw'>('details')
  const [cipherTab, setCipherTab] = useState<'all' | 'strong' | 'weak'>('all')
  const [exportOpen, setExportOpen] = useState(false)
  const [statusText, setStatusText] = useState('Listo · SSL/TLS Inspector v3.1')

  const loadExample = (h: string) => {
    setHost(h)
    runScan(h)
  }

  const runScan = async (overrideHost?: string) => {
    const target = overrideHost || host
    if (!target) return

    setLoading(true)
    setResult(null)
    setCertTab('details')
    setCipherTab('all')
    setStatusText(`Conectando con ${target}…`)

    // Simulate multi-step loading
    await new Promise(r => setTimeout(r, 800))
    setStatusText('Analizando certificado…')
    await new Promise(r => setTimeout(r, 700))
    setStatusText('Probando cipher suites…')
    await new Promise(r => setTimeout(r, 600))

    const data = getMock(target)
    setResult(data)
    setLoading(false)
    setStatusText(`Análisis completado · ${data.domain} · Puerto ${port}`)
  }

  const handleExport = (fmt: 'json' | 'txt' | 'csv') => {
    if (!result) return
    let content = ''
    if (fmt === 'json') {
      content = JSON.stringify(result, null, 2)
    } else if (fmt === 'txt') {
      content =
        `SSL/TLS Report — ${result.domain}\n${'='.repeat(40)}\n\n` +
        `Score: ${result.score}/100 (${result.grade})\nEstado: ${result.status}\n\n` +
        `Certificado\n${'─'.repeat(20)}\n` +
        `CN: ${result.subject.cn}\nOrg: ${result.subject.org}\nEmisor: ${result.issuer.cn}\n` +
        `Válido: ${result.notBefore} → ${result.notAfter} (${result.daysLeft} días)\n\n` +
        `SANs\n${'─'.repeat(20)}\n${result.sans.join('\n')}\n\n` +
        `Vulnerabilidades\n${'─'.repeat(20)}\n` +
        result.vulns.map(v => `[${v.sev.toUpperCase()}] ${v.name}: ${v.desc}`).join('\n')
    } else {
      content = 'Campo,Valor\n' +
        `Dominio,${result.domain}\nScore,${result.score}\nGrade,${result.grade}\n` +
        `CN,${result.subject.cn}\nEmisor,${result.issuer.cn}\n` +
        `NotBefore,${result.notBefore}\nNotAfter,${result.notAfter}\nDíasRestantes,${result.daysLeft}`
    }
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([content], { type: 'text/plain' }))
    a.download = `ssl-report-${result.domain}.${fmt}`
    a.click()
    setExportOpen(false)
    setStatusText(`✓ Exportado como .${fmt}`)
  }

  const copyReport = () => {
    if (!result) return
    navigator.clipboard.writeText(
      `SSL/TLS: ${result.domain} | Score: ${result.score}/100 (${result.grade}) | ${result.daysLeft} días | ${result.bestProtocol}`
    )
    setStatusText('✓ Resumen copiado al portapapeles')
  }

  // Expiry bar calc
  const totalDays = result ? daysBetween(result.notBefore, result.notAfter) : 0
  const usedDays = result ? totalDays - Math.max(result.daysLeft, 0) : 0
  const expiryPct = result ? Math.min(Math.round((usedDays / totalDays) * 100), 100) : 0
  const barColor = result
    ? (result.daysLeft < 0 ? 'var(--red)' : result.daysLeft < 30 ? 'var(--amber)' : 'var(--green)')
    : 'var(--green)'

  // Score ring calc
  const circumference = 2 * Math.PI * 42 // ~264
  const scoreOffset = result ? circumference - (result.score / 100) * circumference : circumference

  // Cipher filter
  const filteredCiphers = result
    ? cipherTab === 'all' ? result.ciphers : cipherTab === 'strong' ? result.ciphers.filter(c => c.strength === 'strong') : result.ciphers.filter(c => c.strength !== 'strong')
    : []

  const weakCount = result ? result.ciphers.filter(c => c.strength !== 'strong').length : 0
  const critVulns = result ? result.vulns.filter(v => v.sev === 'critical').length : 0

  return (
    <div className="space-y-4">
      {/* ── Top Bar ──────────────────────────────────── */}
      <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.04)] rounded-lg p-4 flex items-center gap-4">
        <div className="text-[#666] text-sm font-mono">SSL / TLS</div>
        <span className="text-[#666]">/</span>
        <span className="text-sm text-[#00ff41] font-mono">Inspector</span>
        <div className="flex-1 flex gap-3 items-center">
          <input
            type="text"
            placeholder="Ej: github.com  ·  192.168.1.1  ·  mail.empresa.com"
            value={host}
            onChange={(e) => setHost(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && runScan()}
            className="flex-1 max-w-lg bg-[#111] border border-[rgba(255,255,255,0.08)] rounded-lg px-4 py-2 text-white placeholder-[#666] font-mono text-sm focus:border-[#00ff41] focus:outline-none"
          />
          <input
            type="number"
            value={port}
            onChange={(e) => setPort(e.target.value)}
            min={1}
            max={65535}
            className="w-[72px] bg-[#111] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2 text-white font-mono text-sm text-center focus:border-[#00ff41] focus:outline-none"
          />
          <button
            onClick={() => runScan()}
            disabled={loading || !host}
            className="btn-analyze"
          >
            {loading ? 'Analizando...' : 'Analizar →'}
          </button>

          {/* Export */}
          <div className="relative">
            <button
              onClick={() => setExportOpen(!exportOpen)}
              className="btn-example"
            >
              ⤓ Exportar
            </button>
            {exportOpen && (
              <div className="absolute right-0 top-full mt-2 w-40 bg-[#0a0a0a] border border-[rgba(255,255,255,0.08)] rounded-lg shadow-lg overflow-hidden z-50">
                <div className="px-4 py-2 text-sm text-[#ccc] hover:bg-[#111] hover:text-[#00ff41] cursor-pointer font-mono" onClick={() => handleExport('json')}>JSON (.json)</div>
                <div className="px-4 py-2 text-sm text-[#ccc] hover:bg-[#111] hover:text-[#00ff41] cursor-pointer font-mono" onClick={() => handleExport('txt')}>Texto (.txt)</div>
                <div className="px-4 py-2 text-sm text-[#ccc] hover:bg-[#111] hover:text-[#00ff41] cursor-pointer font-mono" onClick={() => handleExport('csv')}>CSV (.csv)</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading Bar */}
      <div className={`loading-bar ${loading ? 'active' : ''}`}>
        <div className="loading-fill"></div>
      </div>

      {/* ── Empty State ─────────────────────────────── */}
      {!result && !loading && (
        <div className="empty-state">
          <div className="w-[52px] h-[52px] rounded-[14px] bg-[rgba(0,255,65,0.06)] border border-[rgba(0,255,65,0.2)] flex items-center justify-center text-[24px]">🔒</div>
          <div style={{ textAlign: 'center' }}>
            <div className="text-[14px] font-semibold text-white">SSL/TLS Inspector</div>
            <div className="text-[12px] font-mono text-[#666] mt-[4px]">Audita certificados, protocolos y configuración de seguridad</div>
          </div>
          <div className="flex gap-[8px] flex-wrap justify-center max-w-[560px]">
            {EXAMPLES.map(h => (
              <button key={h} onClick={() => loadExample(h)} className="btn-example">{h}</button>
            ))}
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-3 gap-[8px] max-w-[560px] w-full">
            <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.04)] rounded-lg p-[14px] text-center">
              <div className="text-[20px] mb-[6px]">📜</div>
              <div className="text-[11px] font-semibold text-white mb-[3px]">Certificado</div>
              <div className="text-[10px] font-mono text-[#666]">CN, SAN, emisor, validez</div>
            </div>
            <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.04)] rounded-lg p-[14px] text-center">
              <div className="text-[20px] mb-[6px]">🔗</div>
              <div className="text-[11px] font-semibold text-white mb-[3px]">Cadena</div>
              <div className="text-[10px] font-mono text-[#666]">Root, intermedio, leaf</div>
            </div>
            <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.04)] rounded-lg p-[14px] text-center">
              <div className="text-[20px] mb-[6px]">🛡️</div>
              <div className="text-[11px] font-semibold text-white mb-[3px]">Seguridad</div>
              <div className="text-[10px] font-mono text-[#666]">Ciphers, vulns, score</div>
            </div>
          </div>
        </div>
      )}

      {/* ── Result ──────────────────────────────────── */}
      {result && (
        <div className="result visible space-y-4">

          {/* Cert Header */}
          <div className="domain-header">
            <div className={`w-[44px] h-[44px] rounded-[10px] flex items-center justify-center text-[22px] flex-shrink-0 ${
              result.status === 'valid' ? 'bg-[var(--green-bg)] border border-[var(--green-bd)]' :
              result.status === 'warn' ? 'bg-[var(--amber-bg)] border border-[var(--amber-bd)]' :
              'bg-[var(--red-bg)] border border-[var(--red-bd)]'
            }`}>
              {result.status === 'valid' ? '🔒' : result.status === 'warn' ? '⚠️' : '🔓'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[18px] font-semibold text-white letter-spacing-[-0.02em]">{result.domain}</div>
              <div className="text-[11px] font-mono text-[#666] mt-[3px]">{result.issuer.cn} · Puerto {port}</div>
              <div className="flex gap-[6px] flex-wrap mt-2">
                <StatusBadge status={result.status} text={
                  result.status === 'valid' ? 'Certificado válido' : result.status === 'warn' ? 'Advertencia' : 'Certificado inválido'
                } />
                {critVulns > 0 && (
                  <span className="status-badge danger">
                    <span className="s-dot"></span>
                    {critVulns} vulnerabilidad{critVulns > 1 ? 'es críticas' : ' crítica'}
                  </span>
                )}
                {critVulns === 0 && (
                  <span className="status-badge teal">
                    <span className="s-dot"></span>
                    {result.bestProtocol}
                  </span>
                )}
                <span className="status-badge info">
                  <span className="s-dot"></span>
                  Grado {result.grade}
                </span>
              </div>
            </div>
            <div className="flex gap-[8px] flex-shrink-0 self-start">
              <button onClick={copyReport} className="btn-example" style={{ height: '30px', fontSize: '11px' }}>⎘ Copiar</button>
            </div>

            {/* Expiry bar */}
            <div className="w-full mt-[14px] pt-[14px] border-t border-[var(--border)]">
              <div className="bg-[#111] border border-[rgba(255,255,255,0.08)] rounded-[6px] p-[10px_14px] flex flex-col gap-[6px]">
                <div className="flex justify-between text-[10px] font-mono text-[#666]">
                  <span>{result.notBefore}</span>
                  <span>
                    {result.daysLeft < 0
                      ? `Expirado hace ${Math.abs(result.daysLeft)} días`
                      : `${result.daysLeft} días restantes`}
                  </span>
                  <span>{result.notAfter}</span>
                </div>
                <div className="h-[4px] bg-[var(--border)] rounded-[2px] overflow-hidden">
                  <div
                    className="h-full rounded-[2px] transition-[width_0.6s_ease]"
                    style={{ width: `${expiryPct}%`, background: barColor }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="flex gap-[28px] flex-wrap pt-[14px] border-t border-[var(--border)]">
              <div className="flex flex-col gap-[3px]">
                <div className="text-[9px] font-mono text-[#666] uppercase tracking-[0.07em]">Vence en</div>
                <div className={`text-[13px] font-semibold ${result.daysLeft < 0 ? 'text-[#ff3333]' : result.daysLeft < 30 ? 'text-[#ffd700]' : 'text-[#00ff41]'}`}>
                  {result.daysLeft < 0 ? 'Expirado' : `${result.daysLeft} días`}
                </div>
              </div>
              <div className="flex flex-col gap-[3px]">
                <div className="text-[9px] font-mono text-[#666] uppercase tracking-[0.07em]">Protocolo</div>
                <div className="text-[13px] font-semibold text-[#00ff41]">{result.bestProtocol}</div>
              </div>
              <div className="flex flex-col gap-[3px]">
                <div className="text-[9px] font-mono text-[#666] uppercase tracking-[0.07em]">Clave pública</div>
                <div className="text-[13px] font-semibold text-white">{result.keyAlg} {result.keyBits}-bit</div>
              </div>
              <div className="flex flex-col gap-[3px]">
                <div className="text-[9px] font-mono text-[#666] uppercase tracking-[0.07em]">Firma</div>
                <div className="text-[13px] font-semibold text-white">{result.sigAlg}</div>
              </div>
              <div className="flex flex-col gap-[3px]">
                <div className="text-[9px] font-mono text-[#666] uppercase tracking-[0.07em]">Vulnerabilidades</div>
                <div className={`text-[13px] font-semibold ${critVulns === 0 ? 'text-[#00ff41]' : 'text-[#ff3333]'}`}>
                  {critVulns === 0 ? 'Ninguna' : `${critVulns} detectadas`}
                </div>
              </div>
              <div className="flex flex-col gap-[3px]">
                <div className="text-[9px] font-mono text-[#666] uppercase tracking-[0.07em]">Puntuación</div>
                <div className={`text-[13px] font-semibold ${scoreColorClass(result.score)}`}>{result.score} / 100</div>
              </div>
            </div>
          </div>

          {/* ── Two Column Grid ──────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* ── LEFT COLUMN ────────────────────────── */}
            <div className="space-y-4">

              {/* Certificate Panel */}
              <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.04)] rounded-[10px] overflow-hidden">
                <div className="flex items-center justify-between px-[16px] py-[11px] border-b border-[var(--border)]">
                  <div className="flex items-center gap-[8px] text-[12px] font-semibold text-white">
                    <span>📜</span> Certificado
                  </div>
                  <div>
                    {result.daysLeft < 0 ? (
                      <span className="status-badge danger"><span className="s-dot"></span>Expirado</span>
                    ) : result.daysLeft < 30 ? (
                      <span className="status-badge warn"><span className="s-dot"></span>Por vencer</span>
                    ) : (
                      <span className="status-badge safe"><span className="s-dot"></span>Vigente</span>
                    )}
                  </div>
                </div>

                {/* Sub-tabs */}
                <div className="flex border-b border-[var(--border)]">
                  {(['details', 'san', 'raw'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setCertTab(tab)}
                      className={`px-[16px] py-[10px] text-[12px] font-mono transition-colors ${
                        certTab === tab
                          ? 'text-[#00ff41] border-b-[2px] border-[#00ff41] font-medium'
                          : 'text-[#666] hover:text-white'
                      }`}
                    >
                      {tab === 'details' ? 'Detalles' : tab === 'san' ? 'SANs' : 'Raw'}
                    </button>
                  ))}
                </div>

                {/* Details tab */}
                {certTab === 'details' && (
                  <div className="py-[4px]">
                    <table className="kv-table w-full">
                      <tbody>
                        {[
                          ['Common Name', result.subject.cn],
                          ['Organización', result.subject.org],
                          ['País', result.subject.country],
                          ['Emisor CN', result.issuer.cn],
                          ['Emisor Org', result.issuer.org],
                          ['No Before', result.notBefore],
                          ['No After', result.notAfter],
                          ['Algoritmo key', `${result.keyAlg} ${result.keyBits}-bit`],
                          ['Firma', result.sigAlg],
                          ['Nº de serie', result.serial],
                          ['Fingerprint', result.fingerprint],
                        ].map(([k, v], i) => (
                          <tr key={i} className="border-b border-[var(--border)] last:border-b-0">
                            <td className="w-[40%] py-[7px] px-1 text-[11px] font-mono text-[#666] align-top">{k}</td>
                            <td className={`py-[7px] px-1 text-[11px] font-mono word-break-break-all ${
                              k === 'No After'
                                ? (result.daysLeft < 0 ? 'text-[#ff3333]' : result.daysLeft < 30 ? 'text-[#ffd700]' : 'text-[#00ff41]')
                                : 'text-white'
                            }`}>{v}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* SANs tab */}
                {certTab === 'san' && (
                  <div className="p-[12px_16px] space-y-[5px]">
                    {result.sans.map((s, i) => (
                      <div key={i} className="flex items-center gap-[8px] py-[5px] border-b border-[var(--border)] last:border-b-0">
                        <span className="text-[#00ff41] font-mono text-[10px]">◆</span>
                        <span className="font-mono text-[11px] text-white">{s}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Raw tab */}
                {certTab === 'raw' && (
                  <pre className="bg-[#111] p-[12px_16px] m-0 text-[10px] font-mono text-[#999] overflow-x-auto leading-[1.6] max-h-[300px] overflow-y-auto">
{`-----BEGIN CERTIFICATE-----
MIIFXzCCBEegAwIBAgIQDT5FeKLBu/iRRGPR
IOUIJjANBgkqhkiG9w0BAQsFADBWMQswCQYD
VQQGEwJVUzEVMBMGA1UEChMMRGlnaUNlcnQg
SW5jMTAwLgYDVQQDEydEaWdpQ2VydCBUTFMg
...
[Certificado completo de ${result.domain}]
...${result.serial.replace(/:/g, '')}
-----END CERTIFICATE-----`}
                  </pre>
                )}
              </div>

              {/* Chain Panel */}
              <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.04)] rounded-[10px] overflow-hidden">
                <div className="flex items-center justify-between px-[16px] py-[11px] border-b border-[var(--border)]">
                  <div className="flex items-center gap-[8px] text-[12px] font-semibold text-white">
                    <span>🔗</span> Cadena de certificación
                  </div>
                  {result.chain.every(c => c.tagClass !== 'red') ? (
                    <span className="status-badge safe"><span className="s-dot"></span>Cadena completa</span>
                  ) : (
                    <span className="status-badge danger"><span className="s-dot"></span>Cadena inválida</span>
                  )}
                </div>
                <div className="p-[14px_16px]">
                  {result.chain.map((c, i) => (
                    <div key={i} className="flex gap-[12px] items-start pb-[14px] relative last:pb-0">
                      {/* Vertical line */}
                      {i < result.chain.length - 1 && (
                        <div className="absolute left-[13px] top-[28px] w-[1px] h-[calc(100%-14px)] bg-[var(--border)]" />
                      )}
                      <ChainDot type={c.type} />
                      <div className="pt-[3px]">
                        <div className="text-[12px] font-medium text-white flex items-center gap-[6px]">
                          {c.cn}
                          <span className={`text-[9px] font-mono px-[6px] py-[1px] rounded-[2px] ${
                            c.tagClass === 'teal' ? 'bg-[var(--green-bg)] text-[#00ff41] border border-[var(--green-bd)]' :
                            c.tagClass === 'blue' ? 'bg-[var(--blue-bg)] text-[#00ffff] border border-[var(--blue-bd)]' :
                            c.tagClass === 'green' ? 'bg-[var(--green-bg)] text-[#00ff41] border border-[var(--green-bd)]' :
                            'bg-[var(--red-bg)] text-[#ff3333] border border-[var(--red-bd)]'
                          }`}>{c.tag}</span>
                        </div>
                        <div className="text-[10px] font-mono text-[#666] mt-[2px]">{c.org}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN ───────────────────────── */}
            <div className="space-y-4">

              {/* Score + Protocols */}
              <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.04)] rounded-[10px] overflow-hidden">
                <div className="px-[16px] py-[11px] border-b border-[var(--border)] text-[12px] font-semibold text-white flex items-center gap-[8px]">
                  <span>🛡️</span> Evaluación de seguridad
                </div>
                <div className="flex">
                  {/* Score ring */}
                  <div className="flex-1 border-r border-[var(--border)] p-[16px] flex flex-col items-center gap-[10px]">
                    <div className="relative w-[100px] h-[100px] flex items-center justify-center">
                      <svg className="[-webkit-transform:rotate(-90deg)] [transform:rotate(-90deg)]" width="100" height="100" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border)" strokeWidth="8" />
                        <circle
                          cx="50" cy="50" r="42" fill="none" strokeWidth="8" strokeLinecap="round"
                          strokeDasharray={circumference}
                          strokeDashoffset={scoreOffset}
                          stroke={scoreColor(result.score)}
                          className="transition-[stroke-dashoffset_0.8s_ease]"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <div className={`text-[28px] font-bold leading-none ${scoreColorClass(result.score)}`}>{result.score}</div>
                        <div className="text-[12px] font-mono text-[#999] mt-[2px]">{result.grade}</div>
                      </div>
                    </div>
                    <div className="text-[10px] font-mono text-[#666] text-center">Puntuación global SSL</div>
                  </div>

                  {/* Protocols */}
                  <div className="flex-[1.3]">
                    <div className="grid grid-cols-2 gap-[8px] p-[14px_16px]">
                      {result.protocols.map((p, i) => (
                        <div key={i} className="bg-[#111] border border-[rgba(255,255,255,0.08)] rounded-[6px] p-[10px_12px] flex items-center justify-between">
                          <span className="font-mono text-[12px] text-white">{p.name}</span>
                          <span className={`font-mono text-[10px] px-[7px] py-[2px] rounded-[3px] ${
                            p.status === 'ok' ? 'bg-[var(--green-bg)] text-[#00ff41] border border-[var(--green-bd)]' :
                            p.status === 'warn' ? 'bg-[var(--amber-bg)] text-[#ffd700] border border-[var(--amber-bd)]' :
                            'bg-[var(--red-bg)] text-[#ff3333] border border-[var(--red-bd)]'
                          }`}>{p.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Cipher Suites */}
              <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.04)] rounded-[10px] overflow-hidden">
                <div className="flex items-center justify-between px-[16px] py-[11px] border-b border-[var(--border)]">
                  <div className="flex items-center gap-[8px] text-[12px] font-semibold text-white">
                    <span>🔐</span> Cipher Suites
                  </div>
                  <span className="font-mono text-[10px] text-[#666]">
                    {result.ciphers.length} total · {weakCount} débil{weakCount !== 1 ? 'es' : ''}
                  </span>
                </div>
                {/* Sub-tabs */}
                <div className="flex border-b border-[var(--border)]">
                  {(['all', 'strong', 'weak'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setCipherTab(tab)}
                      className={`px-[16px] py-[10px] text-[12px] font-mono transition-colors ${
                        cipherTab === tab
                          ? 'text-[#00ff41] border-b-[2px] border-[#00ff41] font-medium'
                          : 'text-[#666] hover:text-white'
                      }`}
                    >
                      {tab === 'all' ? 'Todos' : tab === 'strong' ? 'Fuertes' : 'Débiles'}
                    </button>
                  ))}
                </div>
                <div className="max-h-[380px] overflow-y-auto">
                  {filteredCiphers.map((c, i) => (
                    <div key={i} className="flex items-center gap-[10px] px-[16px] py-[9px] border-b border-[var(--border)] last:border-b-0 hover:bg-[#111] transition-colors">
                      <div className={`w-[7px] h-[7px] rounded-full flex-shrink-0 ${
                        c.strength === 'strong' ? 'bg-[#00ff41] shadow-[0_0_5px_#00ff41]' : 'bg-[#ff3333] shadow-[0_0_5px_#ff3333]'
                      }`} />
                      <div className="font-mono text-[11px] text-white flex-1">{c.name}</div>
                      <div className="font-mono text-[10px] text-[#666] min-w-[60px]">{c.proto}</div>
                      <div className="font-mono text-[10px] text-[#00ffff] min-w-[50px]">{c.bits}-bit</div>
                    </div>
                  ))}
                  {filteredCiphers.length === 0 && (
                    <div className="px-[16px] py-[20px] text-center text-[11px] font-mono text-[#666]">
                      Sin ciphers en esta categoría
                    </div>
                  )}
                </div>
              </div>

              {/* Vulnerabilities */}
              <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.04)] rounded-[10px] overflow-hidden">
                <div className="flex items-center justify-between px-[16px] py-[11px] border-b border-[var(--border)]">
                  <div className="flex items-center gap-[8px] text-[12px] font-semibold text-white">
                    <span>⚠️</span> Vulnerabilidades conocidas
                  </div>
                  <span className="font-mono text-[10px] text-[#666]">
                    {result.vulns.filter(v => v.sev === 'critical' || v.sev === 'high').length === 0
                      ? 'Sin vulnerabilidades críticas'
                      : `${result.vulns.filter(v => v.sev === 'critical' || v.sev === 'high').length} crítica${result.vulns.filter(v => v.sev === 'critical' || v.sev === 'high').length > 1 ? 's' : ''}`}
                  </span>
                </div>
                {result.vulns.map((v, i) => (
                  <div key={i} className="flex items-start gap-[12px] px-[16px] py-[11px] border-b border-[var(--border)] last:border-b-0 hover:bg-[#111] transition-colors">
                    <div className="text-[15px] flex-shrink-0 mt-[1px]">{v.icon}</div>
                    <div className="flex-1">
                      <div className="text-[12px] font-medium text-white mb-[2px]">{v.name}</div>
                      <div className="text-[11px] text-[#666] leading-[1.5]">{v.desc}</div>
                    </div>
                    <SevBadge sev={v.sev} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Full Width: HTTP Headers ─────────────── */}
          <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.04)] rounded-[10px] overflow-hidden">
            <div className="px-[16px] py-[11px] border-b border-[var(--border)] text-[12px] font-semibold text-white flex items-center gap-[8px]">
              <span>📋</span> Cabeceras de seguridad HTTP
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-0">
              {result.httpHeaders.map((h, i) => (
                <div key={i} className="p-[12px_16px] border-r border-b border-[var(--border)]">
                  <div className="flex items-center justify-between mb-[4px]">
                    <span className="font-mono text-[11px] font-medium text-white">{h.name}</span>
                    <span className={`font-mono text-[9px] px-[6px] py-[1px] rounded-[2px] ${
                      h.status === 'ok' ? 'bg-[var(--green-bg)] text-[#00ff41] border border-[var(--green-bd)]' :
                      h.status === 'warn' ? 'bg-[var(--amber-bg)] text-[#ffd700] border border-[var(--amber-bd)]' :
                      'bg-[var(--red-bg)] text-[#ff3333] border border-[var(--red-bd)]'
                    }`}>
                      {h.status === 'ok' ? 'Presente' : h.status === 'warn' ? 'Parcial' : 'Ausente'}
                    </span>
                  </div>
                  <div className="font-mono text-[10px] text-[#666] whitespace-nowrap overflow-hidden text-ellipsis">{h.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
