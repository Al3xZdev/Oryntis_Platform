import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(
    private configService: ConfigService,
    private dataSource: DataSource,
  ) {}

  async checkTables() {
    try {
      // Get list of tables
      const tables = await this.dataSource.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `);
      
      // Get tenants columns
      const tenantColumns = await this.dataSource.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = 'tenants'
      `);

      // Get profiles columns
      const profileColumns = await this.dataSource.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = 'profiles'
      `);

      return {
        tables: tables.map(t => t.table_name),
        tenantsColumns: tenantColumns,
        profilesColumns: profileColumns,
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  async checkTenants() {
    try {
      const result = await this.dataSource.query('SELECT * FROM tenants LIMIT 5');
      return { tenants: result };
    } catch (error) {
      return { error: error.message };
    }
  }
}