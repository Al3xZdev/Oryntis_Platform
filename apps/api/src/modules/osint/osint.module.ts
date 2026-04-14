import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { WhoisService } from './whois.service';
import { IpService } from './ip.service';
import { UsernameService } from './username.service';
import { OsintController } from './osint.controller';

@Module({
  controllers: [OsintController],
  providers: [EmailService, WhoisService, IpService, UsernameService],
  exports: [EmailService, WhoisService, IpService, UsernameService],
})
export class OsintModule {}