# Oryntis OSINT Platform

Enterprise-grade OSINT (Open Source Intelligence) SaaS Platform built with modern architecture.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![NestJS](https://img.shields.io/badge/NestJS-10-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)

## 🏗️ Arquitectura

```
osint-saas/
├── apps/
│   ├── web/              # Frontend (Next.js 14)
│   │   ├── app/         # Next.js App Router
│   │   ├── components/  # Componentes React
│   │   └── lib/         # Utilidades, hooks, API client
│   │
│   └── api/             # Backend (NestJS)
│       └── src/
│           └── modules/
│               ├── auth/       # Autenticación (JWT, OAuth)
│               ├── users/      # Gestión de usuarios
│               ├── osint/      # Módulos OSINT (email, phone, etc)
│               ├── billing/    # Planes, Stripe, suscripciones
│               ├── usage/      # Tracking de uso, límites
│               └── alerts/     # Alertas y notificaciones
│
├── services/
│   └── osint/           # Workers de escaneo
│
├── packages/
│   ├── ui/              # Componentes compartidos
│   ├── types/           # Tipos TypeScript
│   └── utils/           # Utilidades
│
├── database/
│   └── schema.prisma    # Schema de base de datos
│
└── infra/
    ├── docker/          # Dockerfiles
    └── nginx/           # Configuración nginx
```

## 🚀 Quick Start

### Requisitos

- Node.js 20+
- pnpm 8+
- Docker & Docker Compose

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/Kyuler/OSINT.git osint-saas
cd osint-saas

# 2. Instalar dependencias
pnpm install

# 3. Configurar variables de entorno
cp .env.example .env

# 4. Iniciar con Docker
docker-compose up -d

# O iniciar manualmente:
# Backend: pnpm --filter @oryntis/api dev
# Frontend: pnpm --filter @oryntis web dev
```

## 📡 API Endpoints

### Autenticación
```
POST   /api/auth/signup        # Registro
POST   /api/auth/signin        # Login
POST   /api/auth/signout       # Logout
GET    /api/auth/me            # Usuario actual
GET    /api/auth/google        # OAuth Google
GET    /api/auth/google/callback
```

### OSINT
```
POST   /api/osint/email        # Scan de email
POST   /api/osint/username      # Buscar username
POST   /api/osint/phone        # Análisis de teléfono
POST   /api/osint/domain       # Info de dominio
POST   /api/osint/ip           # Geolocalización IP
POST   /api/osint/whois        # WHOIS lookup
```

### Planes y Uso
```
GET    /api/plans              # Listar planes disponibles
GET    /api/usage              # Ver uso actual
POST   /api/billing/subscribe  # Suscribirse a plan
```

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Frontend** | Next.js 14, React 18, TypeScript, Tailwind CSS, Zustand |
| **Backend** | NestJS, TypeScript, Prisma, JWT |
| **Database** | PostgreSQL (Prisma ORM) |
| **Cache/Queue** | Redis (BullMQ) |
| **Auth** | JWT, OAuth (Google) |
| **Infra** | Docker, Nginx |

## 🔐 Seguridad

- ✅ Autenticación JWT con refresh tokens
- ✅ Rate limiting en todos los endpoints
- ✅ Sanitización de inputs
- ✅ Row Level Security (RLS) en DB
- ✅ HTTPS obligatorio en producción

## 🤝 Contribuir

```bash
# Fork del proyecto
# Crear feature branch
git checkout -b feature/mi-nueva-funcionalidad

# Commit con conventional commits
git commit -m "feat: nueva funcionalidad"

# Push y crear PR
git push origin main


**Oryntis OSINT Platform v2.0.0** - Build with ❤️ by [Kyuler](https://github.com/Kyuler)
