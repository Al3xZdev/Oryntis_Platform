-- =============================================
-- Oryntis Database Schema for InsForge
-- Run this in InsForge SQL Editor
-- =============================================

-- 1. Create tenants table
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  plan TEXT DEFAULT 'free',
  credits_monthly INTEGER DEFAULT 2500,
  max_users INTEGER DEFAULT 5,
  max_investigations INTEGER DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  name TEXT,
  role TEXT DEFAULT 'member',
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Insert default tenant
INSERT INTO tenants (id, name, slug, plan, credits_monthly, max_users, max_investigations)
VALUES ('00000000-0000-0000-0000-000000000001', 'Default Team', 'default', 'free', 2500, 5, 50)
ON CONFLICT (slug) DO NOTHING;

-- 4. Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_tenant_id ON profiles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenants_slug ON tenants(slug);

-- 5. Enable RLS (Row Level Security) - optional
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- 6. Add some test data (optional)
-- INSERT INTO profiles (id, tenant_id, email, password_hash, name, role)
-- VALUES ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'test@test.com', '$2a$10$test', 'Test User', 'admin')
-- ON CONFLICT (email) DO NOTHING;