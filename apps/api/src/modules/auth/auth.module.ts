import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Tenant } from './entities/tenant.entity';
import { Profile } from './entities/profile.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST') || 'ajc4h2ur.us-east.database.insforge.app',
        port: parseInt(configService.get('DB_PORT') || '5432'),
        username: configService.get('DB_USER') || 'postgres',
        password: configService.get('DB_PASSWORD') || 'aa28b5f156a2f87784ffe20d69c83bda',
        database: configService.get('DB_NAME') || 'insforge',
        ssl: { rejectUnauthorized: false },
        entities: [Tenant, Profile],
        synchronize: false, // Tables already exist - disable to avoid conflicts
        logging: false,
      }),
    }),
    TypeOrmModule.forFeature([Tenant, Profile]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}