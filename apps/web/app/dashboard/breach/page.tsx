'use client'

import { useState } from 'react'
import { AlertTriangle, Shield, Database, Activity, Search, Check, X, Globe, Mail, Calendar, Key, Link2, FileText, Copy, CheckCircle, AlertOctagon } from 'lucide-react'

const MOCK_DATA: Record<string, any> = {
  'john.doe@gmail.com': {
    query: 'john.doe@gmail.com', type: 'email', icon: '📧',
    sub: 'Dirección de email · Gmail · Google LLC',
    exposureScore: 72, exposureLabel: 'Alta exposición',
    tags: ['red:Alta exposición', 'amber:3 filtraciones', 'blue:Contraseñas expuestas'],
    metrics: [
      { label: 'Filtraciones', value: '7 halladas', color: 'var(--red)' },
      { label: 'Críticas', value: '3 críticas', color: 'var(--red)' },
      { label: 'Registros', value: '~4.2B total', color: '' },
      { label: 'Años exposición', value: '2013–2023', color: '' },
      { label: 'Contraseñas', value: '4 expuestas', color: 'var(--amber)' },
      { label: 'Última brecha', value: '2023', color: 'var(--amber)' },
    ],
    breaches: [
      { name: 'LinkedIn Data Breach 2021', year: '2021', records: '700M', sev: 'critical', sevLabel: 'CRÍTICO', sevColor: 'var(--red)', description: 'Masiva filtración de 700 millones de perfiles de LinkedIn.', fields: ['email', 'teléfono', 'empresa', 'ubicación'], exposedFields: ['email', 'teléfono', 'empresa'], verified: true, malicious: false },
      { name: 'Collection #1 Credential Dump', year: '2019', records: '2.69B', sev: 'critical', sevLabel: 'CRÍTICO', sevColor: 'var(--red)', description: 'Una de las mayores colecciones de credenciales conocida.', fields: ['email', 'contraseña'], exposedFields: ['email', 'contraseña'], verified: true, malicious: true },
      { name: 'Adobe Systems Breach 2013', year: '2013', records: '153M', sev: 'critical', sevLabel: 'CRÍTICO', sevColor: 'var(--red)', description: 'Brecha masiva de Adobe Creative Cloud.', fields: ['email', 'contraseña', 'hint'], exposedFields: ['email', 'contraseña'], verified: true, malicious: false },
      { name: 'Canva Breach 2019', year: '2019', records: '137M', sev: 'high', sevLabel: 'ALTO', sevColor: 'var(--amber)', description: 'Datos de usuarios de Canva comprometidos.', fields: ['email', 'nombre', 'nombre de usuario'], exposedFields: ['email', 'nombre'], verified: true, malicious: false },
      { name: 'Verify Email Breach', year: '2020', records: '42M', sev: 'medium', sevLabel: 'MEDIO', sevColor: 'var(--blue)', description: 'Base de datos de emails verificados expuesta.', fields: ['email'], exposedFields: ['email'], verified: false, malicious: false },
    ],
    fieldStats: {
      'Email': { count: 7, pct: 100 },
      'Contraseña': { count: 4, pct: 57 },
      'Teléfono': { count: 3, pct: 43 },
      'Nombre': { count: 2, pct: 29 },
      'Empresa': { count: 2, pct: 29 },
      'Ubicación': { count: 1, pct: 14 },
      'IP': { count: 1, pct: 14 },
    },
    timelineItems: [
      { dot: 'critical', icon: '🔓', title: 'LinkedIn Data Breach 2021', meta: '700M registros', description: 'Masiva filtración de datos de LinkedIn expuesta en foro oscuro.', date: '2021-04-08' },
      { dot: 'critical', icon: '🔓', title: 'Collection #1', meta: '2.69B credenciales', description: 'Gran colección de emails y contraseñas filtradas.', date: '2019-01-15' },
      { dot: 'critical', icon: '🔓', title: 'Adobe Breach', meta: '153M registros', description: 'Comprometida la base de datos de usuarios de Adobe.', date: '2013-10-04' },
      { dot: 'high', icon: '⚠️', title: 'Canva Breach', meta: '137M usuarios', description: 'Datos de usuarios de Canva comprometidos.', date: '2019-05-24' },
      { dot: 'medium', icon: '📧', title: 'Verify Email Breach', meta: '42M registros', description: 'Base de datos de emails verificados expuesta.', date: '2020-03-01' },
    ],
    globalStats: [
      { label: 'Filtraciones', value: '12,847', subtitle: 'indexadas' },
      { label: 'Total expuestos', value: '14.5B', subtitle: 'registros' },
      { label: 'Fuentes', value: '847', subtitle: 'verificadas' },
      { label: 'Última act.', value: '2024', subtitle: 'actualización' },
    ],
    recommendations: [
      { prio: 1, title: 'Cambiar contraseñas expuestas', description: 'Las contraseñas de tus cuentas comprometidas deben actualizarse inmediatamente. Priority: critical', color: 'var(--red)' },
      { prio: 2, title: 'Activar 2FA en cuentas críticas', description: 'Habilita autenticación de dos factores en LinkedIn, Gmail y otras cuentas importantes.', color: 'var(--amber)' },
      { prio: 3, title: '监控系统 de identidad', description: 'Considera usar servicios de monitoreo para detectar futuras filtraciones.', color: 'var(--blue)' },
    ],
    related: [
      { name: 'LinkedIn', records: '700M', year: '2021', severity: 'critical', color: 'var(--red)', verified: true, malicious: false },
      { name: 'Adobe', records: '153M', year: '2013', severity: 'critical', color: 'var(--red)', verified: true, malicious: false },
      { name: 'Dropbox', records: '68M', year: '2012', severity: 'high', color: 'var(--amber)', verified: true, malicious: false },
      { name: 'Canva', records: '137M', year: '2019', severity: 'high', color: 'var(--amber)', verified: true, malicious: false },
      { name: 'MySpace', records: '164M', year: '2016', severity: 'medium', color: 'var(--blue)', verified: false, malicious: false },
      { name: 'Collection #1', records: '2.69B', year: '2019', severity: 'critical', color: 'var(--red)', verified: true, malicious: true },
    ],
    etlSegments: [
      { year: '2012', label: 'Dropbox', pct: 8, color: 'var(--amber)' },
      { year: '2013', label: 'Adobe', pct: 15, color: 'var(--red)' },
      { year: '2016', label: 'MySpace', pct: 12, color: 'var(--blue)' },
      { year: '2019', label: 'Canva', pct: 10, color: 'var(--amber)' },
      { year: '2019', label: 'Collection', pct: 15, color: 'var(--red)' },
      { year: '2020', label: 'Verify', pct: 5, color: 'var(--blue)' },
      { year: '2021', label: 'LinkedIn', pct: 35, color: 'var(--red)' },
    ],
    summaryRows: [
      { icon: '📧', key: 'Tipo de query', value: 'Email', class: '' },
      { icon: '🔍', key: 'Fuentes escaneadas', value: '12,847', class: '' },
      { icon: '📅', key: 'Primera exposición', value: '2012', class: '' },
      { icon: '⏰', key: 'Última exposición', value: '2021', class: '' },
      { icon: '📊', key: 'Exposición total', value: '9 años', class: '' },
      { icon: '🔒', key: 'Contraseñas', value: '4 comprometidas', class: 'var(--red)' },
      { icon: '✅', key: 'Verificadas', value: '3 filtraciones', class: 'var(--green)' },
      { icon: '⚠️', key: 'Maliciosas', value: '1 detección', class: 'var(--red)' },
    ],
  },
  'admin@adobe.com': {
    query: 'admin@adobe.com', type: 'email', icon: '📧',
    sub: 'Dirección de email · Adobe Systems',
    exposureScore: 94, exposureLabel: 'Exposición crítica',
    tags: ['red:CRÍTICO', 'red:Múltiples filtraciones', 'blue:Credenciales expuestas'],
    metrics: [
      { label: 'Filtraciones', value: '5 halladas', color: 'var(--red)' },
      { label: 'Críticas', value: '5 críticas', color: 'var(--red)' },
      { label: 'Registros', value: '~900M total', color: '' },
      { label: 'Años exposición', value: '2012–2024', color: '' },
      { label: 'Contraseñas', value: '5 expuestas', color: 'var(--red)' },
      { label: 'Última brecha', value: '2024', color: 'var(--red)' },
    ],
    breaches: [
      { name: 'Adobe Breach 2013', year: '2013', records: '153M', sev: 'critical', sevLabel: 'CRÍTICO', sevColor: 'var(--red)', description: 'Brecha masivo de Adobe Classic - 153M cuentas comprometidas.', fields: ['email', 'contraseña', 'hint'], exposedFields: ['email', 'contraseña', 'hint'], verified: true, malicious: false },
      { name: 'LinkedIn 2021', year: '2021', records: '700M', sev: 'critical', sevLabel: 'CRÍTICO', sevColor: 'var(--red)', description: '700M perfiles profesionale expuestos.', fields: ['email', 'teléfono', 'nombre'], exposedFields: ['email', 'teléfono', 'nombre'], verified: true, malicious: false },
      { name: 'Collection #1', year: '2019', records: '2.69B', sev: 'critical', sevLabel: 'CRÍTICO', sevColor: 'var(--red)', description: '2.69B emails y contraseñas.', fields: ['email', 'contraseña'], exposedFields: ['email', 'contraseña'], verified: true, malicious: true },
    ],
    fieldStats: {
      'Email': { count: 5, pct: 100 },
      'Contraseña': { count: 5, pct: 100 },
      'Teléfono': { count: 3, pct: 60 },
      'Nombre': { count: 4, pct: 80 },
      'Apellido': { count: 3, pct: 60 },
      'Empresa': { count: 2, pct: 40 },
      'IP': { count: 2, pct: 40 },
    },
    timelineItems: [
      { dot: 'critical', icon: '🔓', title: 'LinkedIn Data Breach 2021', meta: '700M registros', description: 'Masiva filtración de datos de LinkedIn.', date: '2021-04-08' },
      { dot: 'critical', icon: '🔓', title: 'Collection #1', meta: '2.69B credenciales', description: 'Gran colección de credenciales.', date: '2019-01-15' },
      { dot: 'critical', icon: '🔓', title: 'Adobe Breach', meta: '153M registros', description: 'Primera brecha masiva de Adobe.', date: '2013-10-04' },
    ],
    recommendations: [
      { prio: 1, title: 'CAMBIAR CONTRASEÑAS INMEDIATAMENTE', description: 'Todas las cuentas asociadas a este email pueden estar comprometidas.', color: 'var(--red)' },
      { prio: 2, title: 'Revisar historial de cuenta', description: 'Verifica actividad sospechosa en todas las cuentas.', color: 'var(--red)' },
      { prio: 3, title: 'Activar 2FA en todas partes', description: 'Usa autenticador para máximo seguridad.', color: 'var(--amber)' },
    ],
    related: [
      { name: 'Adobe', records: '153M', year: '2013', severity: 'critical', color: 'var(--red)', verified: true, malicious: false },
      { name: 'LinkedIn', records: '700M', year: '2021', severity: 'critical', color: 'var(--red)', verified: true, malicious: false },
      { name: 'Collection', records: '2.69B', year: '2019', severity: 'critical', color: 'var(--red)', verified: true, malicious: true },
    ],
    etlSegments: [
      { year: '2013', label: 'Adobe', pct: 30, color: 'var(--red)' },
      { year: '2019', label: 'Collection', pct: 40, color: 'var(--red)' },
      { year: '2021', label: 'LinkedIn', pct: 30, color: 'var(--red)' },
    ],
    summaryRows: [
      { icon: '📧', key: 'Tipo de query', value: 'Email', class: '' },
      { icon: '🔍', key: 'Fuentes escaneadas', value: '12,847', class: '' },
      { icon: '📅', key: 'Primera exposición', value: '2013', class: '' },
      { icon: '⏰', key: 'Última exposición', value: '2021', class: '' },
      { icon: '🔒', key: 'Credenciales', value: '5 comprometidas', class: 'var(--red)' },
    ],
  },
  'user@linkedin.com': {
    query: 'user@linkedin.com', type: 'email', icon: '📧',
    sub: 'Dirección de email · LinkedIn Corporation',
    exposureScore: 88, exposureLabel: 'Exposición crítica',
    tags: ['red:CRÍTICO', 'red:LinkedIn expuesto', 'blue:Datos profesionale'],
    metrics: [
      { label: 'Filtraciones', value: '4 halladas', color: 'var(--red)' },
      { label: 'Críticas', value: '3 críticas', color: 'var(--red)' },
      { label: 'Registros', value: '~850M total', color: '' },
      { label: 'Años exposición', value: '2012–2021', color: '' },
      { label: 'Datos expuestos', value: '5 campos', color: 'var(--amber)' },
      { label: 'Última brecha', value: '2021', color: 'var(--red)' },
    ],
    breaches: [
      { name: 'LinkedIn Data Breach 2021', year: '2021', records: '700M', sev: 'critical', sevLabel: 'CRÍTICO', sevColor: 'var(--red)', description: 'Datos de 700M usuarios de LinkedIn publicados.', fields: ['email', 'nombre', 'apellido', 'teléfono', 'empresa'], exposedFields: ['email', 'nombre', 'teléfono', 'empresa'], verified: true, malicious: false },
      { name: 'LinkedIn 2012', year: '2012', records: '117M', sev: 'critical', sevLabel: 'CRÍTICO', sevColor: 'var(--red)', description: 'Primera brecha masiva de LinkedIn.', fields: ['email', 'contraseña'], exposedFields: ['email', 'contraseña'], verified: true, malicious: false },
    ],
    fieldStats: {
      'Email': { count: 4, pct: 100 },
      'Nombre': { count: 4, pct: 100 },
      'Apellido': { count: 3, pct: 75 },
      'Teléfono': { count: 2, pct: 50 },
      'Empresa': { count: 2, pct: 50 },
      'Ubicación': { count: 1, pct: 25 },
      'Contraseña': { count: 1, pct: 25 },
    },
    timelineItems: [
      { dot: 'critical', icon: '🔓', title: 'LinkedIn 2021', meta: '700M registros', description: '700M perfiles de LinkedIn en venta.', date: '2021-04-08' },
      { dot: 'critical', icon: '🔓', title: 'LinkedIn 2012', meta: '117M registros', description: 'Primera brecha masiva.', date: '2012-06-05' },
    ],
    recommendations: [
      { prio: 1, title: 'Cambiar contraseña LinkedIn', description: 'Tu cuenta LinkedIn puede estar comprometida.', color: 'var(--red)' },
      { prio: 2, title: 'Activar verificación en 2 pasos', description: 'Protege tu cuenta con 2FA.', color: 'var(--amber)' },
    ],
    related: [
      { name: 'LinkedIn 2021', records: '700M', year: '2021', severity: 'critical', color: 'var(--red)', verified: true, malicious: false },
      { name: 'LinkedIn 2012', records: '117M', year: '2012', severity: 'critical', color: 'var(--red)', verified: true, malicious: false },
      { name: 'Adobe', records: '153M', year: '2013', severity: 'critical', color: 'var(--red)', verified: true, malicious: false },
    ],
    etlSegments: [
      { year: '2012', label: 'LinkedIn 1', pct: 20, color: 'var(--red)' },
      { year: '2013', label: 'Adobe', pct: 15, color: 'var(--amber)' },
      { year: '2019', label: 'Collection', pct: 25, color: 'var(--amber)' },
      { year: '2021', label: 'LinkedIn 2', pct: 40, color: 'var(--red)' },
    ],
    summaryRows: [
      { icon: '📧', key: 'Tipo de query', value: 'Email', class: '' },
      { icon: '🔍', key: 'Fuentes escaneadas', value: '12,847', class: '' },
      { icon: '📅', key: 'Primera exposición', value: '2012', class: '' },
      { icon: '⏰', key: 'Última exposición', value: '2021', class: '' },
      { icon: '🔒', key: 'Contraseña expuesta', value: 'Sí', class: 'var(--red)' },
    ],
  },
  'dropbox.com': {
    query: 'dropbox.com', type: 'domain', icon: '🌐',
    sub: 'Dominio de empresa · Dropbox Inc',
    exposureScore: 45, exposureLabel: 'Exposición moderada',
    tags: ['amber:1 filtración', 'blue:68M usuarios'],
    metrics: [
      { label: 'Filtraciones', value: '1 hallada', color: 'var(--amber)' },
      { label: 'Críticas', value: '1 crítica', color: 'var(--amber)' },
      { label: 'Registros', value: '~68M', color: '' },
      { label: 'Años exposición', value: '2012', color: '' },
      { label: 'Dominios asociados', value: '1', color: '' },
      { label: 'Última brecha', value: '2012', color: '' },
    ],
    breaches: [
      { name: 'Dropbox Breach 2012', year: '2012', records: '68M', sev: 'high', sevLabel: 'ALTO', sevColor: 'var(--amber)', description: '68 millones de credenciales de Dropbox filtradas.', fields: ['email', 'contraseña'], exposedFields: ['email', 'contraseña'], verified: true, malicious: false },
    ],
    fieldStats: {
      'Email': { count: 1, pct: 100 },
      'Contraseña': { count: 1, pct: 100 },
    },
    timelineItems: [
      { dot: 'high', icon: '🔓', title: 'Dropbox Breach 2012', meta: '68M registros', description: '68M credenciales de Dropbox comprometidas.', date: '2012-07-01' },
    ],
    recommendations: [
      { prio: 1, title: 'Verificar si usaste Dropbox', description: 'Si tenías cuenta, cambia tu contraseña.', color: 'var(--amber)' },
      { prio: 2, title: 'No reutilizar contraseñas', description: 'Usa contraseña única para Dropbox.', color: 'var(--blue)' },
    ],
    related: [
      { name: 'Dropbox', records: '68M', year: '2012', severity: 'high', color: 'var(--amber)', verified: true, malicious: false },
      { name: 'LinkedIn', records: '117M', year: '2012', severity: 'critical', color: 'var(--red)', verified: true, malicious: false },
    ],
    etlSegments: [
      { year: '2012', label: 'Dropbox', pct: 100, color: 'var(--amber)' },
    ],
    summaryRows: [
      { icon: '🌐', key: 'Tipo de query', value: 'Dominio', class: '' },
      { icon: '🔍', key: 'Fuentes escaneadas', value: '12,847', class: '' },
      { icon: '📅', key: 'Primera exposición', value: '2012', class: '' },
      { icon: '⏰', key: 'Última exposición', value: '2012', class: '' },
    ],
  },
  'LinkedIn': {
    query: 'LinkedIn', type: 'breach', icon: '🔓',
    sub: 'Filtración conocida · 700M+ registros',
    exposureScore: 100, exposureLabel: 'Brecha crítica documentada',
    tags: ['red:CRÍTICO', 'red:Filtración masiva', 'blue:Datos profesionale'],
    metrics: [
      { label: 'Registros afectados', value: '~700M', color: 'var(--red)' },
      { label: 'Años de datos', value: '2012–2021', color: '' },
      { label: 'Fuentes', value: 'Múltiples', color: '' },
      { label: 'Severidad', value: 'CRÍTICO', color: 'var(--red)' },
      { label: 'Estado', value: 'Activa', color: 'var(--amber)' },
      { label: 'Detectada', value: '2021', color: '' },
    ],
    breaches: [
      { name: 'LinkedIn Data Breach 2021', year: '2021', records: '700M', sev: 'critical', sevLabel: 'CRÍTICO', sevColor: 'var(--red)', description: 'Datos completos de 700M perfiles profesionale en venta.', fields: ['email', 'nombre', 'apellido', 'teléfono', 'empresa', 'ubicación'], exposedFields: ['email', 'nombre', 'apellido', 'teléfono', 'empresa', 'ubicación'], verified: true, malicious: false },
      { name: 'LinkedIn Scraping 2021', year: '2021', records: '500M', sev: 'critical', sevLabel: 'CRÍTICO', sevColor: 'var(--red)', description: 'Datos scrapeados de 500M usuarios.', fields: ['email', 'nombre', 'empresa'], exposedFields: ['email', 'nombre'], verified: true, malicious: true },
      { name: 'LinkedIn 2012', year: '2012', records: '117M', sev: 'critical', sevLabel: 'CRÍTICO', sevColor: 'var(--red)', description: 'Primera filtración de 117M contraseñas.', fields: ['email', 'contraseña'], exposedFields: ['email', 'contraseña'], verified: true, malicious: false },
    ],
    fieldStats: {
      'Email': { count: 700, pct: 100 },
      'Nombre': { count: 680, pct: 97 },
      'Apellido': { count: 650, pct: 93 },
      'Teléfono': { count: 420, pct: 60 },
      'Empresa': { count: 500, pct: 71 },
      'Ubicación': { count: 380, pct: 54 },
      'Puesto': { count: 300, pct: 43 },
    },
    timelineItems: [
      { dot: 'critical', icon: '🔓', title: 'LinkedIn 700M', meta: '700M registros', description: 'Datos de 700M usuarios a la venta.', date: '2021-04-08' },
      { dot: 'critical', icon: '🔓', title: 'LinkedIn Scraping', meta: '500M registros', description: '500M perfiles scrapeados.', date: '2021-06-22' },
      { dot: 'critical', icon: '🔓', title: 'LinkedIn 2012', meta: '117M registros', description: 'Primera brecha.', date: '2012-06-05' },
    ],
    recommendations: [
      { prio: 1, title: 'Si usaste LinkedIn, cambia tu contraseña', description: 'Las contraseñas pueden estar comprometidas.', color: 'var(--red)' },
      { prio: 2, title: 'Activa 2FA', description: 'Usa autenticación de dos factores.', color: 'var(--amber)' },
    ],
    related: [
      { name: 'LinkedIn 2021', records: '700M', year: '2021', severity: 'critical', color: 'var(--red)', verified: true, malicious: false },
      { name: 'Adobe', records: '153M', year: '2013', severity: 'critical', color: 'var(--red)', verified: true, malicious: false },
      { name: 'Collection #1', records: '2.69B', year: '2019', severity: 'critical', color: 'var(--red)', verified: true, malicious: true },
    ],
    etlSegments: [
      { year: '2012', label: 'LinkedIn 1', pct: 15, color: 'var(--red)' },
      { year: '2021', label: '700M', pct: 70, color: 'var(--red)' },
      { year: '2021', label: 'Scraping', pct: 15, color: 'var(--amber)' },
    ],
    summaryRows: [
      { icon: '🔓', key: 'Tipo de query', value: 'Filtración', class: '' },
      { icon: '🔍', key: 'Fuentes escaneadas', value: '12,847', class: '' },
      { icon: '📅', key: 'Primera detección', value: '2012', class: '' },
      { icon: '⏰', key: 'Última detección', value: '2021', class: '' },
      { icon: '📊', key: 'Registros afectados', value: '~700M', class: 'var(--red)' },
    ],
  },
  'clean@example.com': {
    query: 'clean@example.com', type: 'email', icon: '📧',
    sub: 'Dirección de email · example.com',
    exposureScore: 0, exposureLabel: 'Sin exposición',
    tags: ['green:Sin filtraciones', 'green:Email seguro'],
    metrics: [
      { label: 'Filtraciones', value: '0 halladas', color: 'var(--green)' },
      { label: 'Registros', value: '0 expuestos', color: 'var(--green)' },
      { label: 'Estado', value: 'Limpio ✓', color: 'var(--green)' },
    ],
    breaches: [],
    fieldStats: {},
    timelineItems: [],
    recommendations: [
      { prio: 1, title: 'Mantener buenas prácticas', description: 'Tu email no aparece en filtraciones. Sigue usando contraseñas únicas y aktif 2FA.', color: 'var(--green)' },
    ],
    related: [],
    etlSegments: [],
    summaryRows: [
      { icon: '📧', key: 'Tipo de query', value: 'Email', class: '' },
      { icon: '🔍', key: 'Fuentes escaneadas', value: '12,847', class: '' },
      { icon: '✅', key: 'Estado', value: 'Sin exposición', class: 'var(--green)' },
    ],
  },
}

export default function BreachPage() {
  const [query, setQuery] = useState('')
  const [queryType, setQueryType] = useState('email')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('breaches')

  const loadExample = (key: string, type: string = 'email') => {
    setQuery(key)
    setQueryType(type)
    setTimeout(() => {
      setLoading(true)
      setTimeout(() => {
        setResult(MOCK_DATA[key] || { query: key, type: type, exposureScore: 0, breaches: [], tags: ['blue:Búsqueda completada'] })
        setLoading(false)
      }, 800)
    }, 100)
  }

  const runSearch = async () => {
    if (!query) return
    setLoading(true)
    setTimeout(() => {
      setResult(MOCK_DATA[query] || { query, type: queryType, exposureScore: 0, breaches: [], tags: ['blue:Búsqueda completada'] })
      setLoading(false)
    }, 1500)
  }

  const getSeverityColor = (sev: string) => {
    switch (sev) { case 'critical': return 'var(--red)'; case 'high': return 'var(--amber)'; case 'medium': return 'var(--blue)'; case 'low': return 'var(--green)'; default: return 'var(--text3)' }
  }

  const getExposureLevel = (score: number) => {
    if (score === 0) return { label: 'Sin exposición', color: 'var(--green)' }
    if (score < 30) return { label: 'Exposición baja', color: 'var(--amber)' }
    if (score < 70) return { label: 'Exposición moderada', color: 'var(--amber)' }
    return { label: 'Exposición crítica', color: 'var(--red)' }
  }

  const formatFieldStats = (fieldStats: Record<string, { count: number, pct: number }>) => {
    if (!fieldStats || Object.keys(fieldStats).length === 0) return []
    const maxVal = Math.max(...Object.values(fieldStats).map(f => f.count))
    return Object.entries(fieldStats).map(([label, data]) => ({
      label,
      value: data.count,
      pct: Math.round(data.count / maxVal * 100),
      displayPct: data.pct
    })).sort((a, b) => b.value - a.value)
  }

  return (
    <div className="space-y-4">
      <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.04)] rounded-lg p-4 flex items-center gap-4">
        <div className="text-[#666] text-sm font-mono">Herramientas</div>
        <span className="text-[#666]">/</span>
        <div className="text-[#ff3333] text-sm font-mono">Breaches</div>
        <div className="flex-1 flex gap-3">
          <input
            type="text"
            placeholder="Email, dominio, empresa o filtración..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && runSearch()}
            className="flex-1 max-w-md bg-[#111] border border-[rgba(255,255,255,0.08)] rounded-lg px-4 py-2 text-white placeholder-[#666] font-mono text-sm focus:border-[#ff3333] focus:outline-none"
          />
          <select
            value={queryType}
            onChange={(e) => setQueryType(e.target.value)}
            className="bg-[#111] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2 text-white font-mono text-sm"
          >
            <option value="email">Email</option>
            <option value="domain">Dominio</option>
            <option value="breach">Filtración</option>
            <option value="company">Empresa</option>
          </select>
          <button onClick={runSearch} disabled={loading || !query} style={{ height: '32px', padding: '0 16px', background: 'var(--red)', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer', opacity: loading || !query ? 0.4 : 1 }}>
            {loading ? 'Verificando...' : 'VERIFICAR'}
          </button>
        </div>
      </div>

      <div className={`loading-bar ${loading ? 'active' : ''}`} style={{ background: 'var(--red)' }}>
        <div className="loading-fill" style={{ background: 'var(--red)' }}></div>
      </div>

      {!result && !loading && (
        <div className="empty-state">
          <div className="empty-icon" style={{ background: 'var(--red-bg)', border: '1px solid var(--red-bd)' }}>
            <AlertTriangle className="w-6 h-6" style={{ color: 'var(--red)' }} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text)' }}>Breaches · Filtraciones de datos</div>
            <div style={{ fontSize: '12px', fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: '5px' }}>Busca exposiciones en más de 12,000 filtraciones conocidas</div>
          </div>
          <div className="empty-grid">
            <div className="empty-card" onClick={() => loadExample('john.doe@gmail.com', 'email')} style={{ borderColor: 'var(--red-bd)' }}>
              <div className="empty-card-title" style={{ color: 'var(--red)' }}>🔓 Expuesto</div>
              <div className="empty-card-sub">john.doe@gmail.com</div>
            </div>
            <div className="empty-card" onClick={() => loadExample('admin@adobe.com', 'email')} style={{ borderColor: 'var(--red-bd)' }}>
              <div className="empty-card-title" style={{ color: 'var(--red)' }}>🔓 Crítico</div>
              <div className="empty-card-sub">admin@adobe.com</div>
            </div>
            <div className="empty-card" onClick={() => loadExample('user@linkedin.com', 'email')} style={{ borderColor: 'var(--red-bd)' }}>
              <div className="empty-card-title" style={{ color: 'var(--red)' }}>🔓 LinkedIn</div>
              <div className="empty-card-sub">user@linkedin.com</div>
            </div>
            <div className="empty-card" onClick={() => loadExample('LinkedIn', 'breach')} style={{ borderColor: 'var(--red-bd)' }}>
              <div className="empty-card-title" style={{ color: 'var(--red)' }}>🔓 Filtración</div>
              <div className="empty-card-sub">LinkedIn</div>
            </div>
            <div className="empty-card" onClick={() => loadExample('dropbox.com', 'domain')}>
              <div className="empty-card-title" style={{ color: 'var(--amber)' }}>🌐 Dominio</div>
              <div className="empty-card-sub">dropbox.com</div>
            </div>
            <div className="empty-card" onClick={() => loadExample('clean@example.com', 'email')} style={{ borderColor: 'var(--green-bd)' }}>
              <div className="empty-card-title" style={{ color: 'var(--green)' }}>✅ Limpio</div>
              <div className="empty-card-sub">clean@example.com</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', maxWidth: '620px', width: '100%' }}>
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '8px', padding: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--red)', fontFamily: 'var(--mono)' }}>12,847</div>
              <div style={{ fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: '4px' }}>filtraciones indexadas</div>
            </div>
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '8px', padding: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--amber)', fontFamily: 'var(--mono)' }}>14.5B</div>
              <div style={{ fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: '4px' }}>registros totales</div>
            </div>
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '8px', padding: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--blue)', fontFamily: 'var(--mono)' }}>847</div>
              <div style={{ fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: '4px' }}>fuentes verificadas</div>
            </div>
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '8px', padding: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--green)', fontFamily: 'var(--mono)' }}>2024</div>
              <div style={{ fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: '4px' }}>última actualización</div>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="result visible">
          <div className="breach-header">
            <div className="bh-inner">
              <div className="bh-icon" style={{ background: 'var(--red-bg)', border: '1px solid var(--red-bd)' }}>
                <span style={{ fontSize: '26px' }}>🔓</span>
              </div>
              <div className="bh-main">
                <div className="bh-query">{result.query}</div>
                <div className="bh-sub">{result.sub}</div>
                <div className="bh-tags" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {result.tags?.map((tag: string, i: number) => {
                    const [color, text] = tag.split(':')
                    return <span key={i} className="tag" style={{ background: color === 'red' ? 'var(--red-bg)' : color === 'green' ? 'var(--green-bg)' : color === 'amber' ? 'var(--amber-bg)' : 'var(--blue-bg)', color: color === 'red' ? 'var(--red)' : color === 'green' ? 'var(--green)' : color === 'amber' ? 'var(--amber)' : 'var(--blue)', border: `1px solid ${color === 'red' ? 'var(--red-bd)' : color === 'green' ? 'var(--green-bd)' : color === 'amber' ? 'var(--amber-bd)' : 'var(--blue-bd)'}` }}>{text}</span>
                  })}
                </div>
              </div>
              <div className="exp-meter">
                <div className="exp-label-top">Exposición</div>
                <div className="exp-ring-wrap">
                  <svg width="72" height="72" viewBox="0 0 72 72" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="36" cy="36" r="29" fill="none" stroke="var(--border)" strokeWidth="6" />
                    <circle cx="36" cy="36" r="29" fill="none" stroke={getExposureLevel(result.exposureScore).color} strokeWidth="6" strokeLinecap="round" strokeDasharray="182" strokeDashoffset={182 - (182 * result.exposureScore / 100)} style={{ transition: 'stroke-dashoffset 0.9s ease' }} />
                  </svg>
                  <span className="exp-num">{result.exposureScore}%</span>
                </div>
                <div className="exp-sub" style={{ color: getExposureLevel(result.exposureScore).color }}>{getExposureLevel(result.exposureScore).label}</div>
              </div>
            </div>
            <div className="bh-metrics" style={{ display: 'flex', borderTop: '1px solid var(--border)' }}>
              {result.metrics?.map((m: any, i: number) => (
                <div key={i} style={{ flex: 1, padding: '11px 16px', borderRight: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '9px', fontFamily: 'var(--mono)', color: 'var(--text3)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '3px' }}>{m.label}</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: m.color || 'var(--text)' }}>{m.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="tabs">
              <button className={`tab ${activeTab === 'breaches' ? 'active' : ''}`} onClick={() => setActiveTab('breaches')} style={{ color: activeTab === 'breaches' ? 'var(--red)' : '' }}>FILTRACIONES</button>
              <button className={`tab ${activeTab === 'fields' ? 'active' : ''}`} onClick={() => setActiveTab('fields')} style={{ color: activeTab === 'fields' ? 'var(--red)' : '' }}>DATOS EXPUESTOS</button>
              <button className={`tab ${activeTab === 'timeline' ? 'active' : ''}`} onClick={() => setActiveTab('timeline')} style={{ color: activeTab === 'timeline' ? 'var(--red)' : '' }}>TIMELINE</button>
              <button className={`tab ${activeTab === 'recs' ? 'active' : ''}`} onClick={() => setActiveTab('recs')} style={{ color: activeTab === 'recs' ? 'var(--red)' : '' }}>RECOMENDACIONES</button>
              <button className={`tab ${activeTab === 'raw' ? 'active' : ''}`} onClick={() => setActiveTab('raw')} style={{ color: activeTab === 'raw' ? 'var(--red)' : '' }}>JSON</button>
            </div>

            <div className={`tab-content ${activeTab === 'breaches' ? 'active' : ''}`}>
              {result.breaches?.length > 0 ? (
                <>
                  <div className="exp-timeline" style={{ marginBottom: '20px', padding: '16px', background: 'var(--bg2)', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>📊 Línea de tiempo de exposición</div>
                    <div style={{ display: 'flex', height: '32px', borderRadius: '6px', overflow: 'hidden', background: 'var(--bg3)', border: '1px solid var(--border)', marginBottom: '8px' }}>
                      {result.etlSegments?.map((seg: any, i: number) => (
                        <div key={i} style={{ width: `${seg.pct}%`, background: seg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontFamily: 'var(--mono)', color: '#fff', fontWeight: 500, borderRight: i < result.etlSegments.length - 1 ? '1px solid var(--bg2)' : 'none' }} title={`${seg.year}: ${seg.label}`}>
                          {seg.pct >= 15 && seg.label}
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontFamily: 'var(--mono)', color: 'var(--text3)' }}>
                      <span>{result.etlSegments?.[0]?.year || '2013'}</span>
                      <span>→</span>
                      <span>{result.etlSegments?.[result.etlSegments.length - 1]?.year || '2024'}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '10px', fontSize: '10px', fontFamily: 'var(--mono)' }}>
                      {result.etlSegments?.slice(0, 5).map((seg: any, i: number) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text3)' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: seg.color }}></div>
                          <span>{seg.year}: {seg.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="scroll-box">
                    {result.breaches.map((b: any, i: number) => (
                      <div key={i} className="breach-card">
                        <div className="bc-header">
                          <div className="bc-sev-bar" style={{ background: b.sevColor }}></div>
                          <div className="bc-main">
                            <div className="bc-name">
                              <span>{b.name}</span>
                              <span style={{ fontSize: '10px', fontFamily: 'var(--mono)', padding: '2px 6px', borderRadius: '2px', background: b.sevColor, color: '#fff' }}>{b.sevLabel}</span>
                            </div>
                            <div className="bc-meta">{b.year} · {b.records} registros</div>
                            <div className="bc-desc">{b.description}</div>
                            <div className="bc-badges" style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                              {b.verified && (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '9px', fontFamily: 'var(--mono)', padding: '2px 6px', borderRadius: '2px', background: 'var(--green-bg)', color: 'var(--green)', border: '1px solid var(--green-bd)' }}>
                                  <CheckCircle className="w-3 h-3" />Verificado
                                </span>
                              )}
                              {b.malicious && (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '9px', fontFamily: 'var(--mono)', padding: '2px 6px', borderRadius: '2px', background: 'var(--red-bg)', color: 'var(--red)', border: '1px solid var(--red-bd)' }}>
                                <AlertOctagon className="w-3 h-3" />Malicioso
                                </span>
                              )}
                            </div>
                            <div className="bc-fields">
                              {b.exposedFields?.map((f: string, j: number) => (
                                <span key={j} className="bc-field exposed">{f}</span>
                              ))}
                            </div>
                          </div>
                          <div className="bc-right">
                            <div className="bc-records" style={{ color: b.sevColor }}>{b.records}</div>
                            <div className="bc-records-label">registros</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ padding: '40px', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', marginBottom: '12px' }}>✅</div>
                  <div style={{ fontSize: '14px', color: 'var(--green)' }}>No se encontraron filtraciones</div>
                  <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '8px' }}>Tu email no aparece en ninguna filtración conocida</div>
                </div>
              )}
            </div>

            <div className={`tab-content ${activeTab === 'timeline' ? 'active' : ''}`}>
              <div className="timeline">
                {result.timelineItems?.length > 0 ? (
                  result.timelineItems.map((item: any, i: number) => (
                    <div key={i} className="tl-item">
                      <div className="tl-dot" style={{ background: item.dot === 'critical' ? 'var(--red-bg)' : item.dot === 'high' ? 'var(--amber-bg)' : 'var(--blue-bg)', border: `1px solid ${item.dot === 'critical' ? 'var(--red)' : item.dot === 'high' ? 'var(--amber)' : 'var(--blue)'}` }}>
                        <span style={{ fontSize: '13px' }}>{item.icon}</span>
                      </div>
                      <div className="tl-body">
                        <div className="tl-title">{item.title}</div>
                        <div className="tl-meta">{item.meta}</div>
                        <div className="tl-desc">{item.description}</div>
                      </div>
                      <div className="tl-date">{item.date}</div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '40px', textAlign: 'center' }}>
                    <div style={{ fontSize: '14px', color: 'var(--text3)' }}>Sin eventos en la timeline</div>
                  </div>
                )}
              </div>
            </div>

            <div className={`tab-content ${activeTab === 'fields' ? 'active' : ''}`}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', padding: '0' }}>
                <div>
                  <div style={{ padding: '12px 16px 6px', fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--text3)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>Tipos de datos comprometidos</div>
                  {formatFieldStats(result.fieldStats).length > 0 ? (
                    <div className="field-bars" style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '9px' }}>
                      {formatFieldStats(result.fieldStats).map((stat, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontSize: '11px', fontFamily: 'var(--mono)', color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              {stat.label}
                              <span style={{ fontSize: '10px', color: 'var(--text3)' }}>({stat.displayPct}%)</span>
                            </div>
                            <div style={{ fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--text3)' }}>{stat.value} filtraciones</div>
                          </div>
                          <div style={{ height: '5px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${stat.pct}%`, borderRadius: '3px', background: i === 0 ? 'var(--red)' : i < 3 ? 'var(--amber)' : 'var(--blue)' }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                      <div style={{ fontSize: '14px', color: 'var(--text3)' }}>No hay datos</div>
                    </div>
                  )}
                </div>
                <div>
                  <div style={{ padding: '12px 16px 6px', fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--text3)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>Estadísticas globales</div>
                  {result.globalStats?.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '14px 16px' }}>
                      {result.globalStats.map((stat: any, i: number) => (
                        <div key={i} style={{ background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: '8px', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ fontSize: '9px', fontFamily: 'var(--mono)', color: 'var(--text3)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>{stat.label}</div>
                          <div style={{ fontSize: '20px', fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>{stat.value}</div>
                          <div style={{ fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--text3)' }}>{stat.subtitle}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                      <div style={{ fontSize: '14px', color: 'var(--text3)' }}>No hay estadísticas</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={`tab-content ${activeTab === 'recs' ? 'active' : ''}`}>
              <div className="rec-list">
                {result.recommendations?.length > 0 ? (
                  result.recommendations.map((rec: any, i: number) => (
                    <div key={i} className="rec-item">
                      <div className="rec-prio" style={{ background: rec.color + '20', color: rec.color, border: `1px solid ${rec.color}` }}>{rec.prio}</div>
                      <div className="rec-body">
                        <div className="rec-title" style={{ color: rec.color }}>{rec.title}</div>
                        <div className="rec-desc">{rec.description}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rec-item">
                    <div className="rec-prio" style={{ background: 'var(--green-bg)', color: 'var(--green)' }}>✓</div>
                    <div className="rec-body">
                      <div className="rec-title" style={{ color: 'var(--green)' }}>Mantener buenas prácticas</div>
                      <div className="rec-desc">Tu email no aparece en filtraciones. Sigue usando contraseñas únicas.</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={`tab-content ${activeTab === 'raw' ? 'active' : ''}`}>
              <pre className="raw-out">{JSON.stringify(result, null, 2)}</pre>
            </div>
          </div>

          {result.related?.length > 0 || result.summaryRows?.length > 0 ? (
            <div className="bottom-panels" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
              {result.related?.length > 0 && (
                <div className="panel-related" style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
                  <div className="panel-header" style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--text3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Filtraciones relacionadas</div>
                    <div style={{ fontSize: '9px', fontFamily: 'var(--mono)', padding: '1px 6px', borderRadius: '2px', background: 'var(--amber-bg)', color: 'var(--amber)', border: '1px solid var(--amber-bd)' }}>{result.related.length}</div>
                  </div>
                  <div className="related-list" style={{ padding: '8px 0' }}>
                    {result.related.slice(0, 6).map((rel: any, i: number) => (
                      <div key={i} className="related-item" style={{ padding: '10px 16px' }}>
                        <div className="rel-sev" style={{ background: rel.color, width: '4px', height: '32px', borderRadius: '2px', flexShrink: 0 }}></div>
                        <div className="rel-main" style={{ flex: 1, minWidth: 0 }}>
                          <div className="rel-name" style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text)', marginBottom: '2px' }}>{rel.name}</div>
                          <div className="rel-meta" style={{ fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--text3)' }}>{rel.records} · {rel.year}</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                          <div className="rel-sev-label" style={{ color: rel.color, fontSize: '9px', fontFamily: 'var(--mono)', fontWeight: 600, textTransform: 'uppercase' }}>{rel.severity}</div>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {rel.verified && (
                              <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '8px', padding: '1px 4px', borderRadius: '2px', background: 'var(--green-bg)', color: 'var(--green)', border: '1px solid var(--green-bd)' }}>
                                <CheckCircle className="w-2 h-2" />
                              </span>
                            )}
                            {rel.malicious && (
                              <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '8px', padding: '1px 4px', borderRadius: '2px', background: 'var(--red-bg)', color: 'var(--red)', border: '1px solid var(--red-bd)' }}>
                                <AlertOctagon className="w-2 h-2" />
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {result.summaryRows?.length > 0 && (
                <div className="panel-summary" style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
                  <div className="panel-header" style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--text3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Resumen</div>
                  </div>
                  <div className="summary-list" style={{ padding: '8px 0' }}>
                    {result.summaryRows.map((row: any, i: number) => (
                      <div key={i} className="summary-row" style={{ padding: '8px 16px' }}>
                        <div style={{ fontSize: '12px', width: '20px', textAlign: 'center' }}>{row.icon}</div>
                        <div style={{ flex: 1, fontSize: '11px', color: 'var(--text3)' }}>{row.key}</div>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: row.class || 'var(--text)', textAlign: 'right' }}>{row.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}