import { Controller, Post, Body } from '@nestjs/common';
import { IpService } from './ip.service';
import { UsernameService } from './username.service';
import { EmailService } from './email.service';
import { WhoisService } from './whois.service';

@Controller('osint')
export class OsintController {
  constructor(
    private readonly ipService: IpService,
    private readonly usernameService: UsernameService,
    private readonly emailService: EmailService,
    private readonly whoisService: WhoisService,
  ) {}

  @Post('ip')
  async ipLookup(@Body() body: { ip: string }) {
    return this.ipService.lookup(body.ip);
  }

  @Post('domain')
  async domainLookup(@Body() body: { domain: string }) {
    const certs = await this.whoisService.getCertificatesCount(body.domain);
    const whois = await this.whoisService.getWhois(body.domain);
    const dns = await this.whoisService.getDnsRecords(body.domain);
    const ssl = await this.whoisService.checkSsl(body.domain);
    
    return {
      domain: body.domain,
      certificates_count: certs,
      // Indicar qué datos son reales vs mock
      data_source: {
        dns_records: dns.length > 0 ? 'real' : 'none',
        certificates: certs > 0 ? 'real' : 'none',
        whois: 'mock', // No hay API gratuita para WHOIS
        ssl: 'mock',   // No hay API gratuita sin límite
        subdomains: 'none', // No implementado
        reputation: 'none', // No implementado
      },
      // Información de debug
      debug: {
        dns_records_count: dns.length,
        certificates_count: certs,
        note: 'Solo DNS y certificados vienen de APIs reales. WHOIS y SSL requieren APIs de pago.'
      },
      ...whois,
      dns_records: dns,
      ssl_info: ssl,
    };
  }

  @Post('username')
  async usernameSearch(@Body() body: { username: string }) {
    return this.usernameService.search(body.username);
  }

  @Post('email')
  async emailLookup(@Body() body: { email: string }) {
    return this.emailService.scanEmail(body.email);
  }

  @Post('phone')
  async phoneLookup(@Body() body: { phone: string }) {
    return this.ipService.phoneLookup(body.phone);
  }

  @Post('dorks')
  async dorkSearch(@Body() body: { dork: string }) {
    return this.usernameService.search(body.dork);
  }
}