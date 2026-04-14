'use client'

import { useState, useRef, useEffect } from 'react'
import { Copy, RotateCcw, Download, ChevronDown, Clock } from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────
interface ContactInfo {
  name: string; org: string; email: string; country: string;
  city: string; state: string; phone: string;
}

interface StatusEntry {
  code: string; color: string; desc: string;
}

interface NSServer {
  name: string; ip: string;
}

interface MXServer {
  name: string; prio: number;
}

interface RelatedDomain {
  name: string; status: string; age: string;
}

interface WhoisResult {
  type: 'domain' | 'ip' | 'asn'
  icon: string
  domain: string
  tld: string
  registrar: string
  registrarUrl: string
  registrarIANA: string
  created: string
  updated: string
  expires: string
  ageYears: number
  daysToExpiry: number | null
  privacy: boolean
  statusCodes: StatusEntry[]
  registrant: ContactInfo
  admin: ContactInfo
  tech: ContactInfo
  ns: NSServer[]
  mx: MXServer[]
  extra: [string, string, string][]
  related: RelatedDomain[]
  badges: string[]
}

interface HistoryEntry {
  q: string; type: string; time: string;
}

// ── Mock Data ──────────────────────────────────────────────────────
const MOCKS: Record<string, WhoisResult> = {
  'github.com': {
    type: 'domain', icon: '🌐',
    domain: 'github.com', tld: '.com',
    registrar: 'MarkMonitor Inc.',
    registrarUrl: 'https://markmonitor.com',
    registrarIANA: '292',
    created: '2007-10-09', updated: '2023-09-07', expires: '2025-10-09',
    ageYears: 17, daysToExpiry: 180,
    privacy: false,
    statusCodes: [
      { code: 'clientDeleteProhibited', color: 'teal', desc: 'Protege contra eliminación no autorizada del dominio.' },
      { code: 'clientTransferProhibited', color: 'teal', desc: 'Bloquea transferencias a otros registradores.' },
      { code: 'clientUpdateProhibited', color: 'teal', desc: 'Impide modificaciones no autorizadas de datos.' },
      { code: 'serverDeleteProhibited', color: 'blue', desc: 'Protección a nivel de registro de ICANN.' },
      { code: 'serverTransferProhibited', color: 'blue', desc: 'Bloqueo de transferencia a nivel de servidor.' },
      { code: 'serverUpdateProhibited', color: 'blue', desc: 'Actualización bloqueada en el servidor.' },
    ],
    registrant: { name: 'GitHub, Inc.', org: 'GitHub, Inc.', email: 'REDACTED FOR PRIVACY', country: 'US', city: 'San Francisco', state: 'CA', phone: 'REDACTED' },
    admin: { name: 'REDACTED FOR PRIVACY', org: 'REDACTED', email: 'REDACTED FOR PRIVACY', country: 'US', city: 'REDACTED', state: 'CA', phone: 'REDACTED' },
    tech: { name: 'REDACTED FOR PRIVACY', org: 'REDACTED', email: 'REDACTED FOR PRIVACY', country: 'US', city: 'REDACTED', state: 'CA', phone: 'REDACTED' },
    ns: [
      { name: 'ns-1707.awsdns-21.co.uk', ip: '205.251.198.171' },
      { name: 'ns-421.awsdns-52.com', ip: '205.251.193.165' },
      { name: 'ns-520.awsdns-01.net', ip: '205.251.194.8' },
      { name: 'ns-1283.awsdns-32.org', ip: '205.251.197.3' },
    ],
    mx: [
      { name: 'aspmx.l.google.com', prio: 1 },
      { name: 'alt1.aspmx.l.google.com', prio: 5 },
      { name: 'alt2.aspmx.l.google.com', prio: 5 },
      { name: 'alt3.aspmx.l.google.com', prio: 10 },
    ],
    extra: [
      ['DNSSEC', 'unsigned', 'warn'],
      ['Whois Server', 'whois.markmonitor.com', ''],
      ['Referral URL', 'http://www.markmonitor.com', ''],
      ['Último update', '2024-03-15T08:22:11Z', ''],
      ['TLD Registry', 'VeriSign (.com)', ''],
      ['IANA ID', '292', 'violet'],
    ],
    related: [
      { name: 'github.io', status: 'owned', age: '2013' },
      { name: 'github.net', status: 'other', age: '–' },
      { name: 'github.org', status: 'other', age: '2009' },
      { name: 'githubapp.com', status: 'owned', age: '2012' },
      { name: 'githubusercontent.com', status: 'owned', age: '2011' },
    ],
    badges: ['green:Dominio activo', 'violet:Registrar verificado', 'teal:Privacy OFF · Datos visibles'],
  },

  'paypal-secure.net': {
    type: 'domain', icon: '⚠️',
    domain: 'paypal-secure.net', tld: '.net',
    registrar: 'Namecheap, Inc.',
    registrarUrl: 'https://namecheap.com',
    registrarIANA: '1068',
    created: '2024-01-15', updated: '2024-01-15', expires: '2025-01-15',
    ageYears: 0, daysToExpiry: 9,
    privacy: true,
    statusCodes: [
      { code: 'addPeriod', color: 'amber', desc: 'Período de añadido — recién registrado, aún en gracia.' },
      { code: 'clientTransferProhibited', color: 'teal', desc: 'Bloquea transferencias a otros registradores.' },
    ],
    registrant: { name: 'REDACTED FOR PRIVACY', org: 'Privacy service provided by Withheld for Privacy ehf', email: 'REDACTED FOR PRIVACY', country: 'IS', city: 'Reykjavik', state: 'Capital Region', phone: 'REDACTED' },
    admin: { name: 'REDACTED FOR PRIVACY', org: 'REDACTED', email: 'REDACTED FOR PRIVACY', country: 'IS', city: 'REDACTED', state: 'REDACTED', phone: 'REDACTED' },
    tech: { name: 'REDACTED FOR PRIVACY', org: 'REDACTED', email: 'REDACTED FOR PRIVACY', country: 'IS', city: 'REDACTED', state: 'REDACTED', phone: 'REDACTED' },
    ns: [
      { name: 'ns1.namecheaphosting.com', ip: '198.54.114.149' },
      { name: 'ns2.namecheaphosting.com', ip: '198.54.115.149' },
    ],
    mx: [
      { name: 'mail.paypal-secure.net', prio: 10 },
    ],
    extra: [
      ['DNSSEC', 'unsigned', 'warn'],
      ['Whois Server', 'whois.namecheap.com', ''],
      ['Registrado', 'hace 3 meses', 'amber'],
      ['Privacidad', 'Activada (IS)', 'amber'],
      ['Riesgo typo', 'Suplantación PayPal', 'bad'],
      ['IANA ID', '1068', 'violet'],
    ],
    related: [
      { name: 'paypal.com', status: 'legit', age: '1999' },
      { name: 'paypal-login.net', status: 'suspicious', age: '2024' },
      { name: 'paypal-verify.com', status: 'suspicious', age: '2023' },
      { name: 'paypal-secure.com', status: 'suspicious', age: '2023' },
    ],
    badges: ['amber:Dominio sospechoso', 'red:Posible phishing', 'amber:Vence en 9 días'],
  },

  'google.com': {
    type: 'domain', icon: '🌐',
    domain: 'google.com', tld: '.com',
    registrar: 'MarkMonitor Inc.',
    registrarUrl: 'https://markmonitor.com',
    registrarIANA: '292',
    created: '1997-09-15', updated: '2023-09-07', expires: '2028-09-14',
    ageYears: 27, daysToExpiry: 875,
    privacy: false,
    statusCodes: [
      { code: 'clientDeleteProhibited', color: 'teal', desc: 'Protege contra eliminación no autorizada.' },
      { code: 'clientTransferProhibited', color: 'teal', desc: 'Bloquea transferencias.' },
      { code: 'clientUpdateProhibited', color: 'teal', desc: 'Impide modificaciones.' },
      { code: 'serverDeleteProhibited', color: 'blue', desc: 'Protección ICANN nivel servidor.' },
      { code: 'serverTransferProhibited', color: 'blue', desc: 'Bloqueo de transferencia ICANN.' },
      { code: 'serverUpdateProhibited', color: 'blue', desc: 'Actualización bloqueada ICANN.' },
    ],
    registrant: { name: 'Google LLC', org: 'Google LLC', email: 'dns-admin@google.com', country: 'US', city: 'Mountain View', state: 'CA', phone: '+1.6502530000' },
    admin: { name: 'Google LLC', org: 'Google LLC', email: 'dns-admin@google.com', country: 'US', city: 'Mountain View', state: 'CA', phone: '+1.6502530000' },
    tech: { name: 'Google LLC', org: 'Google LLC', email: 'dns-admin@google.com', country: 'US', city: 'Mountain View', state: 'CA', phone: '+1.6502530000' },
    ns: [
      { name: 'ns1.google.com', ip: '216.239.32.10' },
      { name: 'ns2.google.com', ip: '216.239.34.10' },
      { name: 'ns3.google.com', ip: '216.239.36.10' },
      { name: 'ns4.google.com', ip: '216.239.38.10' },
    ],
    mx: [
      { name: 'smtp.google.com', prio: 10 },
    ],
    extra: [
      ['DNSSEC', 'signed (DS record)', 'good'],
      ['Whois Server', 'whois.markmonitor.com', ''],
      ['TLD Registry', 'VeriSign (.com)', ''],
      ['Antigüedad', '27 años', 'violet'],
      ['Renovado hasta', '2028-09-14', 'good'],
      ['IANA ID', '292', 'violet'],
    ],
    related: [
      { name: 'google.co.uk', status: 'owned', age: '1999' },
      { name: 'google.es', status: 'owned', age: '2003' },
      { name: 'google.ar', status: 'owned', age: '2000' },
      { name: 'google.io', status: 'other', age: '–' },
      { name: 'googl.com', status: 'owned', age: '2010' },
    ],
    badges: ['green:Dominio activo', 'violet:27 años de antigüedad', 'green:DNSSEC habilitado'],
  },

  'amazon.com': {
    type: 'domain', icon: '🌐',
    domain: 'amazon.com', tld: '.com',
    registrar: 'MarkMonitor Inc.',
    registrarUrl: 'https://markmonitor.com',
    registrarIANA: '292',
    created: '1994-11-01', updated: '2023-10-22', expires: '2024-10-31',
    ageYears: 30, daysToExpiry: 203,
    privacy: false,
    statusCodes: [
      { code: 'clientDeleteProhibited', color: 'teal', desc: 'Protege contra eliminación.' },
      { code: 'clientTransferProhibited', color: 'teal', desc: 'Bloquea transferencias.' },
      { code: 'clientUpdateProhibited', color: 'teal', desc: 'Impide modificaciones.' },
      { code: 'serverDeleteProhibited', color: 'blue', desc: 'Protección ICANN.' },
      { code: 'serverTransferProhibited', color: 'blue', desc: 'Bloqueo ICANN.' },
      { code: 'serverUpdateProhibited', color: 'blue', desc: 'Actualización bloqueada ICANN.' },
    ],
    registrant: { name: 'Amazon Technologies, Inc.', org: 'Amazon Technologies, Inc.', email: 'hostmaster@amazon.com', country: 'US', city: 'Reno', state: 'NV', phone: '+1.2062664064' },
    admin: { name: 'Amazon Technologies, Inc.', org: 'Amazon Technologies, Inc.', email: 'hostmaster@amazon.com', country: 'US', city: 'Reno', state: 'NV', phone: '+1.2062664064' },
    tech: { name: 'Amazon Technologies, Inc.', org: 'Amazon Technologies, Inc.', email: 'hostmaster@amazon.com', country: 'US', city: 'Reno', state: 'NV', phone: '+1.2062664064' },
    ns: [
      { name: 'ns1.p31.dynect.net', ip: '208.78.70.31' },
      { name: 'ns2.p31.dynect.net', ip: '204.13.250.31' },
      { name: 'pdns1.ultradns.net', ip: '204.74.108.1' },
      { name: 'pdns6.ultradns.co.uk', ip: '156.154.65.1' },
    ],
    mx: [
      { name: 'smtp-in.amazon.com', prio: 5 },
      { name: 'fb-smtp-in.amazon.com', prio: 10 },
    ],
    extra: [
      ['DNSSEC', 'unsigned', 'warn'],
      ['Antigüedad', '30 años', 'violet'],
      ['TLD Registry', 'VeriSign (.com)', ''],
      ['Whois Server', 'whois.markmonitor.com', ''],
      ['IANA ID', '292', 'violet'],
      ['Renovado hasta', '2024-10-31', 'good'],
    ],
    related: [
      { name: 'amazon.co.uk', status: 'owned', age: '1998' },
      { name: 'amazon.es', status: 'owned', age: '2004' },
      { name: 'amazon.com.ar', status: 'owned', age: '2013' },
      { name: 'amzn.com', status: 'owned', age: '1999' },
    ],
    badges: ['green:Dominio activo', 'violet:30 años de antigüedad', 'amber:DNSSEC sin firmar'],
  },

  '8.8.8.8': {
    type: 'ip', icon: '📡',
    domain: '8.8.8.8', tld: 'IP Address',
    registrar: 'ARIN',
    registrarUrl: 'https://arin.net',
    registrarIANA: '–',
    created: '1992-12-01', updated: '2023-06-05', expires: '–',
    ageYears: 32, daysToExpiry: null,
    privacy: false,
    statusCodes: [
      { code: 'ALLOCATED', color: 'green', desc: 'Bloque de IPs asignado a una organización.' },
      { code: 'DIRECT ALLOCATION', color: 'blue', desc: 'Asignación directa desde registro regional.' },
    ],
    registrant: { name: 'Google LLC', org: 'Google LLC', email: 'arin-contact@google.com', country: 'US', city: 'Mountain View', state: 'CA', phone: '+1-650-253-0000' },
    admin: { name: 'Google LLC', org: 'Google LLC', email: 'arin-contact@google.com', country: 'US', city: 'Mountain View', state: 'CA', phone: '+1-650-253-0000' },
    tech: { name: 'Google LLC', org: 'Google LLC', email: 'arin-contact@google.com', country: 'US', city: 'Mountain View', state: 'CA', phone: '+1-650-253-0000' },
    ns: [],
    mx: [],
    extra: [
      ['ASN', 'AS15169', 'violet'],
      ['Red', '8.8.8.0/24', 'teal'],
      ['CIDR', '8.8.8.0 – 8.8.8.255', ''],
      ['RIR', 'ARIN', ''],
      ['Tipo', 'DNS Público (Google)', 'good'],
      ['Abuso', 'abuse@google.com', ''],
    ],
    related: [
      { name: '8.8.4.4', status: 'owned', age: '1992' },
      { name: 'AS15169', status: 'asn', age: '–' },
      { name: '8.8.8.0/24', status: 'cidr', age: '–' },
    ],
    badges: ['green:IP activa', 'violet:AS15169 · Google LLC', 'blue:ARIN · Norteamérica'],
  },

  '1.1.1.1': {
    type: 'ip', icon: '📡',
    domain: '1.1.1.1', tld: 'IP Address',
    registrar: 'APNIC',
    registrarUrl: 'https://apnic.net',
    registrarIANA: '–',
    created: '2018-04-01', updated: '2023-01-10', expires: '–',
    ageYears: 6, daysToExpiry: null,
    privacy: false,
    statusCodes: [
      { code: 'ALLOCATED PORTABLE', color: 'green', desc: 'Bloque portable asignado a APNIC / Cloudflare.' },
    ],
    registrant: { name: 'APNIC and Cloudflare DNS Resolver Project', org: 'Cloudflare, Inc.', email: 'apnic-abuse@apnic.net', country: 'AU', city: 'South Brisbane', state: 'Queensland', phone: '+61-7-3858-3100' },
    admin: { name: 'Cloudflare, Inc.', org: 'Cloudflare, Inc.', email: 'abuse@cloudflare.com', country: 'US', city: 'San Francisco', state: 'CA', phone: '+1-650-319-8930' },
    tech: { name: 'Cloudflare, Inc.', org: 'Cloudflare, Inc.', email: 'abuse@cloudflare.com', country: 'US', city: 'San Francisco', state: 'CA', phone: '+1-650-319-8930' },
    ns: [],
    mx: [],
    extra: [
      ['ASN', 'AS13335', 'violet'],
      ['Red', '1.1.1.0/24', 'teal'],
      ['CIDR', '1.1.1.0 – 1.1.1.255', ''],
      ['RIR', 'APNIC', ''],
      ['Tipo', 'DNS Público (Cloudflare)', 'good'],
      ['Abuso', 'abuse@cloudflare.com', ''],
    ],
    related: [
      { name: '1.0.0.1', status: 'owned', age: '2018' },
      { name: 'AS13335', status: 'asn', age: '–' },
    ],
    badges: ['green:IP activa', 'violet:AS13335 · Cloudflare', 'teal:APNIC · Asia-Pacífico'],
  },

  'AS15169': {
    type: 'asn', icon: '🏢',
    domain: 'AS15169', tld: 'Autonomous System',
    registrar: 'ARIN',
    registrarUrl: 'https://arin.net',
    registrarIANA: '–',
    created: '2000-03-30', updated: '2023-09-01', expires: '–',
    ageYears: 24, daysToExpiry: null,
    privacy: false,
    statusCodes: [
      { code: 'ALLOCATED', color: 'green', desc: 'ASN asignado a organización verificada.' },
    ],
    registrant: { name: 'Google LLC', org: 'Google LLC', email: 'arin-contact@google.com', country: 'US', city: 'Mountain View', state: 'CA', phone: '+1-650-253-0000' },
    admin: { name: 'Google LLC', org: 'Google LLC', email: 'arin-contact@google.com', country: 'US', city: 'Mountain View', state: 'CA', phone: '+1-650-253-0000' },
    tech: { name: 'Google LLC', org: 'Google LLC', email: 'arin-contact@google.com', country: 'US', city: 'Mountain View', state: 'CA', phone: '+1-650-253-0000' },
    ns: [], mx: [],
    extra: [
      ['Prefijos IPv4', '~3,500 rutas', 'violet'],
      ['Prefijos IPv6', '~900 rutas', 'teal'],
      ['Peers', '~900', ''],
      ['IXPs', 'DE-CIX, AMS-IX, LINX…', ''],
      ['Tipo', 'Transit / Content', ''],
      ['RIR', 'ARIN', ''],
    ],
    related: [
      { name: '8.8.8.0/24', status: 'cidr', age: '–' },
      { name: '8.8.4.0/24', status: 'cidr', age: '–' },
      { name: 'AS13335', status: 'asn', age: '–' },
      { name: 'google.com', status: 'domain', age: '1997' },
    ],
    badges: ['green:ASN activo', 'violet:Google LLC', 'blue:ARIN · Norteamérica'],
  },
}

const EXAMPLES = [
  { name: 'github.com', type: 'domain' },
  { name: 'google.com', type: 'domain' },
  { name: 'amazon.com', type: 'domain' },
  { name: '8.8.8.8', type: 'ip' },
  { name: '1.1.1.1', type: 'ip' },
  { name: 'AS15169', type: 'asn' },
  { name: 'paypal-secure.net', type: 'domain' },
]

// ── Helpers ────────────────────────────────────────────────────────
function daysBetween(a: string, b: string): number {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000)
}

function today(): string {
  return new Date().toISOString().split('T')[0]
}

function randomHex(n: number): string {
  return [...Array(n)].map(() => Math.floor(Math.random() * 16).toString(16).toUpperCase()).join('')
}

function getMock(q: string): WhoisResult {
  const key = Object.keys(MOCKS).find(k => q.toLowerCase().includes(k.toLowerCase()))
  const m = key ? JSON.parse(JSON.stringify(MOCKS[key])) : JSON.parse(JSON.stringify(MOCKS['github.com']))
  if (!key) m.domain = q
  return m
}

function generateRaw(d: WhoisResult): string {
  const lines: string[] = []
  lines.push(`% WHOIS data for ${d.domain}`)
  lines.push(`% Query: ${d.domain}`)
  lines.push(`% Source: Oryntis WHOIS Engine v2.1`)
  lines.push(`% Timestamp: ${new Date().toISOString()}`)
  lines.push('')
  if (d.type === 'domain') {
    lines.push(`Domain Name: ${d.domain.toUpperCase()}`)
    lines.push(`Registry Domain ID: ${randomHex(20)}_DOMAIN_COM-VRSN`)
    lines.push(`Registrar WHOIS Server: whois.${d.registrar.toLowerCase().replace(/[^a-z.]/g, '')}`)
    lines.push(`Registrar URL: ${d.registrarUrl}`)
    lines.push(`Updated Date: ${d.updated}T08:00:00Z`)
    lines.push(`Creation Date: ${d.created}T00:00:00Z`)
    lines.push(`Registry Expiry Date: ${d.expires}T00:00:00Z`)
    lines.push(`Registrar: ${d.registrar}`)
    lines.push(`Registrar IANA ID: ${d.registrarIANA}`)
    lines.push(`Registrar Abuse Contact Email: abusecomplaints@${d.registrar.toLowerCase().replace(/[^a-z]/g, '')}.com`)
    lines.push('')
    d.statusCodes.forEach(s => lines.push(`Domain Status: ${s.code} https://icann.org/epp#${s.code}`))
    lines.push('')
    lines.push(`Registrant Name: ${d.registrant.name}`)
    lines.push(`Registrant Organization: ${d.registrant.org}`)
    lines.push(`Registrant Country: ${d.registrant.country}`)
    lines.push(`Registrant Email: ${d.registrant.email}`)
    lines.push('')
    d.ns.forEach(n => lines.push(`Name Server: ${n.name.toUpperCase()}`))
    lines.push('')
    lines.push(`DNSSEC: unsigned`)
    lines.push('')
    lines.push(`>>> Last update of WHOIS database: ${new Date().toISOString()} <<<`)
  } else if (d.type === 'ip') {
    lines.push(`NetRange: ${d.domain} - ${d.domain}`)
    const red = d.extra.find(e => e[0] === 'Red')
    lines.push(`CIDR: ${red ? red[1] : d.domain + '/24'}`)
    lines.push(`NetName: GOOGLE`)
    lines.push(`NetHandle: NET-${d.domain.replace(/\./g, '-')}`)
    lines.push(`OrgId: GOOGL`)
    lines.push(`OrgName: ${d.registrant.org}`)
    lines.push(`Country: ${d.registrant.country}`)
    lines.push(`RegDate: ${d.created}`)
    lines.push(`Updated: ${d.updated}`)
    lines.push('')
    lines.push(`OrgTechEmail: ${d.tech.email}`)
    lines.push(`OrgAbuseEmail: ${d.admin.email}`)
  } else {
    lines.push(`aut-num: ${d.domain}`)
    lines.push(`as-name: GOOGLE`)
    lines.push(`descr: ${d.registrant.org}`)
    lines.push(`country: ${d.registrant.country}`)
    lines.push(`org: ORG-GL1-RIPE`)
    lines.push(`admin-c: GOOG1-RIPE`)
    lines.push(`tech-c:  GOOG1-RIPE`)
    lines.push(`status: ASSIGNED`)
    lines.push(`source: RIPE`)
  }
  return lines.join('\n')
}

// ── Main Page ──────────────────────────────────────────────────────
export default function WhoisPage() {
  const [query, setQuery] = useState('')
  const [queryType, setQueryType] = useState('auto')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<WhoisResult | null>(null)
  const [mainTab, setMainTab] = useState<'registro' | 'contactos' | 'dns' | 'estados' | 'raw'>('registro')
  const [exportOpen, setExportOpen] = useState(false)
  const [statusText, setStatusText] = useState('Listo · WHOIS Lookup Engine v2.1')
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [showHistoryView, setShowHistoryView] = useState(false)

  const loadExample = (name: string, type: string) => {
    setQuery(name)
    setQueryType(type)
    runQuery(name)
  }

  const runQuery = async (overrideQuery?: string) => {
    const target = overrideQuery || query
    if (!target) return

    setLoading(true)
    setResult(null)
    setShowHistoryView(false)
    setMainTab('registro')
    setStatusText(`Consultando WHOIS para ${target}…`)

    await new Promise(r => setTimeout(r, 700))
    setStatusText('Resolviendo DNS…')
    await new Promise(r => setTimeout(r, 900))

    const data = getMock(target)
    data.domain = target
    setResult(data)
    setLoading(false)

    // Add to history
    setHistory(prev => {
      const filtered = prev.filter(h => h.q !== target)
      return [{ q: target, type: data.type, time: new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' }) }, ...filtered].slice(0, 30)
    })

    setStatusText(`Consulta completada · ${target} · ${data.type.toUpperCase()}`)
  }

  const copyRaw = () => {
    if (!result) return
    navigator.clipboard.writeText(generateRaw(result))
    setStatusText('✓ Raw WHOIS copiado al portapapeles')
  }

  const handleExport = (fmt: 'json' | 'txt' | 'csv') => {
    if (!result) return
    let content = ''
    if (fmt === 'json') {
      content = JSON.stringify(result, null, 2)
    } else if (fmt === 'txt') {
      content = generateRaw(result)
    } else {
      content = 'Campo,Valor\n' +
        `Dominio,${result.domain}\nTipo,${result.type}\nRegistrar,${result.registrar}\n` +
        `Creado,${result.created}\nExpira,${result.expires}\nAntigüedad,${result.ageYears} años\n` +
        `Privacidad,${result.privacy}\nName Servers,${result.ns.map(n => n.name).join(' | ')}`
    }
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([content], { type: 'text/plain' }))
    a.download = `whois-${result.domain}.${fmt}`
    a.click()
    setExportOpen(false)
    setStatusText(`✓ Exportado como .${fmt}`)
  }

  // Age bar calc
  const totalDays = result && result.type === 'domain' && result.expires !== '–'
    ? daysBetween(result.created, result.expires) : 0
  const usedDays = result && result.type === 'domain' && result.expires !== '–'
    ? daysBetween(result.created, today()) : 0
  const agePct = totalDays > 0 ? Math.min(Math.round((usedDays / totalDays) * 100), 100) : 0
  const barColor = result
    ? (result.daysToExpiry !== null && result.daysToExpiry < 0 ? 'var(--red)'
      : result.daysToExpiry !== null && result.daysToExpiry < 30 ? 'var(--amber)' : 'var(--green)')
    : 'var(--green)'

  const statusColorMap: Record<string, string> = {
    green: 'safe', bad: 'danger', warn: 'warn', amber: 'warn',
    teal: 'info', blue: 'info', violet: 'info',
  }

  const badgeColorMap: Record<string, string> = {
    green: 'safe', red: 'danger', amber: 'warn',
    blue: 'info', violet: 'info', teal: 'info',
  }

  const relColorMap: Record<string, string> = {
    owned: 'safe', suspicious: 'warn', legit: 'info', other: '',
    asn: 'info', cidr: 'teal', domain: 'info',
  }

  return (
    <div className="space-y-4">
      {/* ── Top Bar ──────────────────────────────────── */}
      <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.04)] rounded-lg p-4 flex items-center gap-4">
        <div className="text-[#666] text-sm font-mono">WHOIS</div>
        <span className="text-[#666]">/</span>
        <div className="flex-1 flex gap-3 items-center">
          <input
            type="text"
            placeholder="Ej: github.com  ·  8.8.8.8  ·  AS15169"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && runQuery()}
            className="flex-1 max-w-md bg-[#111] border border-[rgba(255,255,255,0.08)] rounded-lg px-4 py-2 text-white placeholder-[#666] font-mono text-sm focus:border-[#00ff41] focus:outline-none"
          />
          <select
            value={queryType}
            onChange={(e) => setQueryType(e.target.value)}
            className="bg-[#111] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2 text-[#999] font-mono text-[11px] focus:border-[#00ff41] focus:outline-none cursor-pointer"
          >
            <option value="auto">Auto-detectar</option>
            <option value="domain">Dominio</option>
            <option value="ip">IP</option>
            <option value="asn">ASN</option>
          </select>
          <button
            onClick={() => runQuery()}
            disabled={loading || !query}
            className="btn-analyze"
            style={{ background: 'var(--green)' }}
          >
            {loading ? 'Consultando...' : 'Consultar →'}
          </button>
          <button
            onClick={() => {
              if (!history.length) {
                setStatusText('Sin historial todavía')
                return
              }
              setShowHistoryView(true)
              setResult(null)
            }}
            className="btn-example"
          >
            <Clock className="w-3 h-3 mr-1 inline" /> Historial
          </button>

          {/* Export */}
          <div className="relative">
            <button onClick={() => setExportOpen(!exportOpen)} className="btn-example">
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
        <div className="loading-fill" style={{ background: 'var(--green)' }}></div>
      </div>

      {/* ── History View ─────────────────────────────── */}
      {showHistoryView && history.length > 0 && !result && (
        <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.04)] rounded-[10px] overflow-hidden">
          <div className="px-[16px] py-[11px] border-b border-[var(--border)] text-[10px] font-mono text-[#666] uppercase tracking-[0.1em] flex items-center justify-between">
            <span>Historial de consultas</span>
            <button onClick={() => setShowHistoryView(false)} className="text-[#999] hover:text-white cursor-pointer text-[11px]">✕ Cerrar</button>
          </div>
          {history.map((h, i) => (
            <div
              key={i}
              className="flex items-center gap-[10px] px-[16px] py-[9px] border-b border-[var(--border)] last:border-b-0 cursor-pointer hover:bg-[#111] transition-colors"
              onClick={() => loadExample(h.q, h.type)}
            >
              <span className="font-mono text-[11px] text-[#00ff41] flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{h.q}</span>
              <span className="font-mono text-[9px] px-[6px] py-[1px] rounded-[2px] bg-[#111] text-[#666] border border-[var(--border)]">{h.type}</span>
              <span className="font-mono text-[10px] text-[#666] whitespace-nowrap">{h.time}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Empty State ─────────────────────────────── */}
      {!result && !loading && !showHistoryView && (
        <div className="empty-state">
          <div className="w-[52px] h-[52px] rounded-[14px] bg-[var(--green-bg)] border border-[var(--green-bd)] flex items-center justify-center text-[24px]">📋</div>
          <div style={{ textAlign: 'center' }}>
            <div className="text-[14px] font-semibold text-white">WHOIS Lookup</div>
            <div className="text-[12px] font-mono text-[#666] mt-[4px]">Consulta información de registro de dominios, IPs y sistemas autónomos</div>
          </div>
          <div className="flex gap-[8px] flex-wrap justify-center max-w-[580px]">
            {EXAMPLES.map(e => (
              <button key={e.name} onClick={() => loadExample(e.name, e.type)} className="btn-example">{e.name}</button>
            ))}
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-3 gap-[8px] max-w-[520px] w-full">
            <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.04)] rounded-lg p-[14px] text-center">
              <div className="text-[20px] mb-[6px]">🌐</div>
              <div className="text-[11px] font-semibold text-white mb-[3px]">Dominios</div>
              <div className="text-[10px] font-mono text-[#666]">Registrar, fechas, NS, MX</div>
            </div>
            <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.04)] rounded-lg p-[14px] text-center">
              <div className="text-[20px] mb-[6px]">📡</div>
              <div className="text-[11px] font-semibold text-white mb-[3px]">IPs</div>
              <div className="text-[10px] font-mono text-[#666]">ARIN, RIPE, LACNIC, ASN</div>
            </div>
            <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.04)] rounded-lg p-[14px] text-center">
              <div className="text-[20px] mb-[6px]">🏢</div>
              <div className="text-[11px] font-semibold text-white mb-[3px]">ASN</div>
              <div className="text-[10px] font-mono text-[#666]">Prefijos, peers, organización</div>
            </div>
          </div>
        </div>
      )}

      {/* ── Result ──────────────────────────────────── */}
      {result && !showHistoryView && (
        <div className="result visible space-y-4">

          {/* WHOIS Header */}
          <div className="domain-header">
            <div className="w-[44px] h-[44px] rounded-[10px] bg-[var(--green-bg)] border border-[var(--green-bd)] flex items-center justify-center text-[20px] flex-shrink-0">
              {result.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[20px] font-bold text-white letter-spacing-[-0.02em]">{result.domain}</div>
              <div className="text-[11px] font-mono text-[#666] mt-[3px]">
                {result.type.toUpperCase()} · {result.tld} · {result.registrar}
              </div>
              <div className="flex gap-[6px] flex-wrap mt-2">
                {result.badges.map((b, i) => {
                  const [color, label] = b.split(':')
                  return (
                    <span key={i} className={`status-badge ${badgeColorMap[color] || 'info'}`}>
                      <span className="s-dot"></span>
                      {label}
                    </span>
                  )
                })}
              </div>
            </div>
            <div className="flex gap-[8px] flex-shrink-0 self-start">
              <button onClick={copyRaw} className="btn-example" style={{ height: '30px', fontSize: '11px' }}>⎘ Raw</button>
              <button onClick={() => runQuery()} className="btn-example" style={{ height: '30px', fontSize: '11px' }}>↺ Re-query</button>
            </div>

            {/* Age bar (domain only) */}
            {result.type === 'domain' && result.expires !== '–' && (
              <div className="w-full mt-[14px] pt-[14px] border-t border-[var(--border)]">
                <div className="bg-[#111] border border-[rgba(255,255,255,0.08)] rounded-[6px] p-[10px_14px] flex flex-col gap-[6px]">
                  <div className="flex justify-between text-[10px] font-mono text-[#666]">
                    <span>{result.created}</span>
                    <span style={{ color: 'var(--green)' }}>
                      {result.daysToExpiry !== null
                        ? (result.daysToExpiry > 0 ? `${result.daysToExpiry} días para vencer` : 'Expirado')
                        : ''}
                    </span>
                    <span>{result.expires}</span>
                  </div>
                  <div className="h-[4px] bg-[var(--border)] rounded-[2px] relative overflow-visible">
                    <div
                      className="h-full rounded-[2px] transition-[width_0.8s_ease]"
                      style={{ width: `${agePct}%`, background: barColor }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Metrics */}
            <div className="flex gap-[28px] flex-wrap pt-[14px] border-t border-[var(--border)]">
              <div className="flex flex-col gap-[3px]">
                <div className="text-[9px] font-mono text-[#666] uppercase tracking-[0.07em]">Registrado</div>
                <div className="text-[13px] font-semibold text-white">{result.created}</div>
              </div>
              <div className="flex flex-col gap-[3px]">
                <div className="text-[9px] font-mono text-[#666] uppercase tracking-[0.07em]">Vence</div>
                <div className={`text-[13px] font-semibold ${
                  result.daysToExpiry !== null && result.daysToExpiry < 30 ? 'text-[#ffd700]' :
                  result.daysToExpiry !== null && result.daysToExpiry < 0 ? 'text-[#ff3333]' : 'text-white'
                }`}>
                  {result.expires || '–'}
                </div>
              </div>
              <div className="flex flex-col gap-[3px]">
                <div className="text-[9px] font-mono text-[#666] uppercase tracking-[0.07em]">Antigüedad</div>
                <div className="text-[13px] font-semibold text-[#00ff41]">
                  {result.ageYears > 0 ? `${result.ageYears} años` : '< 1 año'}
                </div>
              </div>
              <div className="flex flex-col gap-[3px]">
                <div className="text-[9px] font-mono text-[#666] uppercase tracking-[0.07em]">Registrar</div>
                <div className="text-[11px] font-semibold text-white">{result.registrar}</div>
              </div>
              <div className="flex flex-col gap-[3px]">
                <div className="text-[9px] font-mono text-[#666] uppercase tracking-[0.07em]">Estado</div>
                <div className="text-[13px] font-semibold text-white">{result.statusCodes.length} códigos EPP</div>
              </div>
              <div className="flex flex-col gap-[3px]">
                <div className="text-[9px] font-mono text-[#666] uppercase tracking-[0.07em]">Privacidad</div>
                <div className={`text-[13px] font-semibold ${result.privacy ? 'text-[#ffd700]' : 'text-[#00ff41]'}`}>
                  {result.privacy ? 'Activada' : 'Desactivada'}
                </div>
              </div>
            </div>
          </div>

          {/* ── Main Tabs Panel ──────────────────────── */}
          <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.04)] rounded-[10px] overflow-hidden">
            {/* Tab bar */}
            <div className="flex border-b border-[var(--border)]">
              {([
                ['registro', 'Registro'],
                ['contactos', 'Contactos'],
                ['dns', 'DNS'],
                ['estados', 'Estados EPP'],
                ['raw', 'Raw WHOIS'],
              ] as const).map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setMainTab(id)}
                  className={`px-[16px] py-[10px] text-[12px] font-mono transition-colors ${
                    mainTab === id
                      ? 'text-[#00ff41] border-b-[2px] border-[#00ff41] font-medium'
                      : 'text-[#666] hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* REGISTRO tab */}
            {mainTab === 'registro' && (
              <div className="py-[4px]">
                {[
                  ['Tipo de consulta', result.type.toUpperCase(), 'violet'],
                  ['Dominio / objeto', result.domain, ''],
                  ['TLD / Tipo', result.tld, ''],
                  ['Registrar', result.registrar, ''],
                  ['IANA ID', result.registrarIANA || '–', 'violet'],
                  ['URL Registrar', result.registrarUrl, 'teal'],
                  ['Fecha creación', result.created, ''],
                  ['Última actualización', result.updated || '–', ''],
                  ['Fecha expiración', result.expires || '–',
                    result.daysToExpiry !== null && result.daysToExpiry < 30 ? 'warn' :
                    result.daysToExpiry !== null && result.daysToExpiry < 0 ? 'bad' : ''],
                  ['Antigüedad', result.ageYears > 0 ? `${result.ageYears} años` : '< 1 año', 'violet'],
                  ['Protección privacidad', result.privacy ? 'Sí — datos ocultos' : 'No — datos visibles',
                    result.privacy ? 'warn' : 'good'],
                  ['Nº status codes', `${result.statusCodes.length} estados EPP`, ''],
                ].map(([k, v, cls], i) => (
                  <div key={i} className="flex justify-between items-start px-[16px] py-[8px] border-b border-[var(--border)] last:border-b-0 gap-[12px]">
                    <span className="text-[11px] font-mono text-[#666] flex-shrink-0 min-w-[130px]">{k}</span>
                    <span className={`text-[11px] font-mono text-right word-break-break-all ${
                      cls === 'good' ? 'text-[#00ff41]' : cls === 'warn' ? 'text-[#ffd700]' :
                      cls === 'bad' ? 'text-[#ff3333]' : cls === 'violet' ? 'text-[#00ff41]' :
                      cls === 'teal' ? 'text-[#00ffff]' : 'text-white'
                    }`}>{v}</span>
                  </div>
                ))}
              </div>
            )}

            {/* CONTACTOS tab */}
            {mainTab === 'contactos' && (
              <div>
                {[
                  { id: 'registrant', label: 'Registrante', data: result.registrant },
                  { id: 'admin', label: 'Administrador', data: result.admin },
                  { id: 'tech', label: 'Técnico', data: result.tech },
                ].map(({ label, data }) => (
                  <div key={label}>
                    <div className="text-[10px] font-mono text-[#666] uppercase tracking-[0.08em] px-[16px] pt-[12px] pb-[8px] flex items-center gap-[8px]">
                      <span>{label}</span>
                      <span className="flex-1 h-[1px] bg-[var(--border)]"></span>
                    </div>
                    <div className="mx-[16px] mb-[12px] p-[12px_14px] bg-[#111] border border-[rgba(255,255,255,0.08)] rounded-[8px]">
                      {[
                        ['Nombre', data.name],
                        ['Organización', data.org],
                        ['Email', data.email],
                        ['Teléfono', data.phone],
                        ['País', data.country],
                        ['Ciudad', data.city],
                        ['Estado', data.state],
                      ].map(([k, v]) => (
                        <div key={k} className="flex gap-[8px] mb-[4px] last:mb-0">
                          <span className="font-mono text-[10px] text-[#666] min-w-[80px]">{k}</span>
                          <span className="font-mono text-[10px] text-[#999] word-break-break-all">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* DNS tab */}
            {mainTab === 'dns' && (
              <div>
                <div className="text-[10px] font-mono text-[#666] uppercase tracking-[0.08em] px-[16px] pt-[12px] pb-[8px] flex items-center gap-[8px]">
                  <span>Name Servers</span>
                  <span className="flex-1 h-[1px] bg-[var(--border)]"></span>
                </div>
                {result.ns.length > 0 ? (
                  result.ns.map((n, i) => (
                    <div key={i} className="flex items-center gap-[10px] px-[16px] py-[9px] border-b border-[var(--border)] last:border-b-0 hover:bg-[#111] transition-colors">
                      <span className="font-mono text-[9px] text-[#666] min-w-[18px]">{i + 1}</span>
                      <div className="w-[6px] h-[6px] rounded-full bg-[#00ff41] shadow-[0_0_5px_#00ff41]" />
                      <span className="font-mono text-[11px] text-white flex-1">{n.name}</span>
                      <span className="font-mono text-[10px] text-[#666]">{n.ip}</span>
                    </div>
                  ))
                ) : (
                  <div className="px-[16px] py-[14px] font-mono text-[11px] text-[#666]">No aplica para este tipo de consulta</div>
                )}

                <div className="text-[10px] font-mono text-[#666] uppercase tracking-[0.08em] px-[16px] pt-[12px] pb-[8px] flex items-center gap-[8px]">
                  <span>Registros MX</span>
                  <span className="flex-1 h-[1px] bg-[var(--border)]"></span>
                </div>
                {result.mx.length > 0 ? (
                  result.mx.map((m, i) => (
                    <div key={i} className="flex items-center gap-[10px] px-[16px] py-[9px] border-b border-[var(--border)] last:border-b-0 hover:bg-[#111] transition-colors">
                      <span className="font-mono text-[9px] text-[#666] min-w-[18px]">MX</span>
                      <div className="w-[6px] h-[6px] rounded-full bg-[#00ff41] shadow-[0_0_5px_#00ff41]" />
                      <span className="font-mono text-[11px] text-white flex-1">{m.name}</span>
                      <span className="font-mono text-[10px] text-[#00ff41] min-w-[30px] text-right">{m.prio}</span>
                    </div>
                  ))
                ) : (
                  <div className="px-[16px] py-[14px] font-mono text-[11px] text-[#666]">Sin registros MX</div>
                )}
              </div>
            )}

            {/* ESTADOS EPP tab */}
            {mainTab === 'estados' && (
              <div>
                {result.statusCodes.map((s, i) => {
                  const bgVar = s.color === 'teal' ? 'var(--green-bg)' : s.color === 'blue' ? 'var(--blue-bg)' : s.color === 'amber' ? 'var(--amber-bg)' : s.color === 'red' ? 'var(--red-bg)' : 'var(--green-bg)'
                  const colorVar = s.color === 'teal' ? 'var(--green)' : s.color === 'blue' ? 'var(--blue)' : s.color === 'amber' ? 'var(--amber)' : s.color === 'red' ? 'var(--red)' : 'var(--green)'
                  const bdVar = s.color === 'teal' ? 'var(--green-bd)' : s.color === 'blue' ? 'var(--blue-bd)' : s.color === 'amber' ? 'var(--amber-bd)' : s.color === 'red' ? 'var(--red-bd)' : 'var(--green-bd)'
                  return (
                    <div key={i} className="flex items-start gap-[10px] px-[16px] py-[9px] border-b border-[var(--border)] last:border-b-0 hover:bg-[#111] transition-colors">
                      <span className="font-mono text-[9px] px-[7px] py-[2px] rounded-[3px] flex-shrink-0 mt-[1px]"
                        style={{ background: bgVar, color: colorVar, border: `1px solid ${bdVar}` }}>
                        EPP
                      </span>
                      <div>
                        <div className="text-[12px] font-medium text-white mb-[2px]">{s.code}</div>
                        <div className="text-[11px] text-[#666] leading-[1.4]">{s.desc}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* RAW WHOIS tab */}
            {mainTab === 'raw' && (
              <pre className="bg-[#111] p-[14px_16px] m-0 text-[10px] font-mono text-[#999] overflow-x-auto leading-[1.7] max-h-[360px] overflow-y-auto whitespace-pre">
                {generateRaw(result)}
              </pre>
            )}
          </div>

          {/* ── Bottom Two-Column ────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Extra Info */}
            <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.04)] rounded-[10px] overflow-hidden">
              <div className="px-[16px] py-[11px] border-b border-[var(--border)] text-[12px] font-semibold text-white flex items-center gap-[8px]">
                <span>📊</span> Información adicional
              </div>
              {result.extra.map(([k, v, cls], i) => (
                <div key={i} className="flex justify-between items-start px-[16px] py-[8px] border-b border-[var(--border)] last:border-b-0 gap-[12px]">
                  <span className="text-[11px] font-mono text-[#666] flex-shrink-0 min-w-[130px]">{k}</span>
                  <span className={`text-[11px] font-mono text-right word-break-break-all ${
                    cls === 'good' ? 'text-[#00ff41]' : cls === 'warn' ? 'text-[#ffd700]' :
                    cls === 'bad' ? 'text-[#ff3333]' : cls === 'violet' ? 'text-[#00ff41]' :
                    cls === 'teal' ? 'text-[#00ff41]' : 'text-white'
                  }`}>{v}</span>
                </div>
              ))}
            </div>

            {/* Related Domains */}
            <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.04)] rounded-[10px] overflow-hidden">
              <div className="px-[16px] py-[11px] border-b border-[var(--border)] text-[12px] font-semibold text-white flex items-center justify-between gap-[8px]">
                <div className="flex items-center gap-[8px]">
                  <span>🔍</span> Dominios relacionados
                </div>
                <span className="font-mono text-[10px] text-[#666]">{result.related.length} encontrados</span>
              </div>
              <div className="max-h-[340px] overflow-y-auto">
                {result.related.map((r, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-[10px] px-[16px] py-[9px] border-b border-[var(--border)] last:border-b-0 cursor-pointer hover:bg-[#111] transition-colors"
                    onClick={() => loadExample(r.name, 'domain')}
                  >
                    <span className="font-mono text-[11px] text-[#00ff41] flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{r.name}</span>
                    <span className="font-mono text-[10px] text-[#666]">{r.age !== '–' ? r.age : ''}</span>
                    <span className={`pill ${relColorMap[r.status] || ''}`}
                      style={relColorMap[r.status] === '' ? {
                        background: 'var(--bg3)', color: 'var(--text3)', border: '1px solid var(--border)'
                      } : {}}>
                      {r.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Status Bar ──────────────────────────────── */}
      <div className="h-[24px] border-t border-[var(--border)] bg-[#0a0a0a] flex items-center px-[16px] gap-[16px] flex-shrink-0">
        <div className="w-[6px] h-[6px] rounded-full bg-[#00ff41] shadow-[0_0_6px_#00ff41]" />
        <span className="font-mono text-[10px] text-[#666]">{statusText}</span>
        <span className="font-mono text-[10px] text-[#666] ml-auto">Backend conectado · API v2.0 · localhost:5000</span>
      </div>
    </div>
  )
}
