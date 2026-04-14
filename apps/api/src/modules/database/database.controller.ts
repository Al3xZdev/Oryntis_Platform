import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Controller('debug')
export class DatabaseController {
  constructor(private dbService: DatabaseService) {}

  @Get('tables')
  async checkTables() {
    return this.dbService.checkTables();
  }

  @Get('tenants')
  async checkTenants() {
    return this.dbService.checkTenants();
  }
}