import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class InsForgeService implements OnModuleInit {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get('INSFORGE_URL') || 'https://ajc4h2ur.us-east.insforge.app';
    const supabaseKey = this.configService.get('INSFORGE_SERVICE_KEY') || 'ik_714c0f4649688238cea266e796238133';
    
    this.supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }

  async onModuleInit() {
    // Auto-initialize on startup
    console.log('🔧 Checking InsForge database...');
    await this.initializeDatabase();
  }

  async initializeDatabase() {
    try {
      // 1. Create tenant if not exists
      const { data: existingTenant } = await this.supabase
        .from('tenants')
        .select('id')
        .eq('slug', 'default')
        .single();

      if (!existingTenant) {
        const { error: tenantError } = await this.supabase.from('tenants').insert({
          id: '00000000-0000-0000-0000-000000000001',
          name: 'Default Team',
          slug: 'default',
          plan: 'free',
          credits_monthly: 2500,
          max_users: 5,
          max_investigations: 50,
        });

        if (tenantError && !tenantError.message.includes('already exists')) {
          console.log('⚠️ Tenant creation:', tenantError.message);
        } else {
          console.log('✅ Default tenant created');
        }
      } else {
        console.log('✅ Default tenant exists');
      }

      // 2. Try to test profiles table
      const { error: profileTest } = await this.supabase
        .from('profiles')
        .select('id')
        .limit(1)
        .single();

      if (profileTest) {
        console.log('⚠️ Profiles table issue:', profileTest.message);
        console.log('📝 Please create tables in InsForge dashboard');
      } else {
        console.log('✅ Profiles table accessible');
      }

    } catch (error) {
      console.log('🔧 Database initialization:', error.message);
    }
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }
}