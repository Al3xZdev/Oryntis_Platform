import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class DatabaseSetupService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get('INSFORGE_URL') || 'https://ajc4h2ur.us-east.insforge.app';
    const supabaseKey = this.configService.get('INSFORGE_SERVICE_KEY') || 'ik_714c0f4649688238cea266e796238133';
    
    this.supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }

  async createTables() {
    const results: any = {};

    // Create tenants table via SQL
    try {
      const { error } = await this.supabase.rpc('create_tenants_table', {});
      results.tenants = error ? error.message : 'success';
    } catch (e: any) {
      // Try direct insert instead
      const { error } = await this.supabase.from('tenants').insert({
        id: '00000000-0000-0000-0000-000000000001',
        name: 'Default Team',
        slug: 'default',
        plan: 'free',
        credits_monthly: 2500,
        max_users: 5,
        max_investigations: 50,
      }).select();
      
      results.tenants = error ? error.message : 'created';
    }

    return results;
  }

  async checkTables() {
    const tables = ['tenants', 'profiles'];
    const results: any = {};

    for (const table of tables) {
      try {
        const { data, error } = await this.supabase
          .from(table)
          .select('*')
          .limit(1);

        results[table] = error ? `Error: ${error.message}` : 'exists';
      } catch (e: any) {
        results[table] = `Not found: ${e.message}`;
      }
    }

    return results;
  }
}