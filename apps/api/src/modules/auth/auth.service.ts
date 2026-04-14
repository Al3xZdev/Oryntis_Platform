import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { Tenant } from './entities/tenant.entity';
import { Profile } from './entities/profile.entity';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  plan: string;
  tenant_id: string;
}

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly secretKey: string;
  private readonly algorithm = 'HS256';
  private readonly tokenExpireMinutes: number;
  private readonly googleClientId: string;
  private readonly googleClientSecret: string;
  private readonly googleRedirectUri: string;
  
  // Google OAuth config
  private readonly GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
  private readonly GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
  private readonly GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';
  private readonly GOOGLE_SCOPES = 'openid email profile';

  constructor(
    private configService: ConfigService,
    @InjectRepository(Tenant) private tenantRepo: Repository<Tenant>,
    @InjectRepository(Profile) private profileRepo: Repository<Profile>,
  ) {
    this.secretKey = this.configService.get('SECRET_KEY') || 'change-me-in-production';
    this.tokenExpireMinutes = this.configService.get('ACCESS_TOKEN_EXPIRE_MINUTES') || 60;
    this.googleClientId = this.configService.get('GOOGLE_CLIENT_ID') || '';
    this.googleClientSecret = this.configService.get('GOOGLE_CLIENT_SECRET') || '';
    this.googleRedirectUri = this.configService.get('GOOGLE_REDIRECT_URI') || 'http://localhost:5000/api/auth/google/callback';
  }

  async onModuleInit() {
    console.log('🔧 Checking database tables...');
    await this.ensureDefaultTenant();
  }

  private async ensureDefaultTenant() {
    const existing = await this.tenantRepo.findOne({ where: { slug: 'default' } });
    if (!existing) {
      const tenant = this.tenantRepo.create({
        id: '00000000-0000-0000-0000-000000000001',
        name: 'Default Team',
        slug: 'default',
        plan: 'free',
        creditsMonthly: 2500,
        maxUsers: 5,
        maxInvestigations: 50,
      });
      await this.tenantRepo.save(tenant);
      console.log('✅ Default tenant created');
    } else {
      console.log('✅ Default tenant exists');
    }
  }

  private hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  private verifyPassword(plain: string, hashed: string): boolean {
    return bcrypt.compareSync(plain, hashed);
  }

  private createToken(userId: string, tenantId: string, email: string, role: string): string {
    const expire = new Date();
    expire.setMinutes(expire.getMinutes() + this.tokenExpireMinutes);
    
    const payload = {
      sub: userId,
      tenant_id: tenantId,
      email: email,
      role: role,
      exp: Math.floor(expire.getTime() / 1000),
      type: 'access',
      iat: Math.floor(Date.now() / 1000),
    };
    
    return jwt.sign(payload, this.secretKey, { algorithm: this.algorithm });
  }

  async signUp(email: string, password: string, name?: string) {
    try {
      // Check if user exists
      const existingUser = await this.profileRepo.findOne({ where: { email: email.toLowerCase() } });
      if (existingUser) {
        throw new Error('Email already registered');
      }

      // Hash password
      const passwordHash = this.hashPassword(password);
      const userId = uuidv4();

      // Get or create default tenant
      let tenant = await this.tenantRepo.findOne({ where: { slug: 'default' } });
      if (!tenant) {
        tenant = await this.tenantRepo.save({
          name: 'Default Team',
          slug: 'default',
          plan: 'free',
          creditsMonthly: 2500,
          maxUsers: 5,
          maxInvestigations: 50,
        });
      }

      // Create user
      const profile = this.profileRepo.create({
        id: userId,
        tenantId: tenant.id,
        email: email.toLowerCase(),
        passwordHash: passwordHash,
        name: name || email.split('@')[0],
        role: 'admin',
      });
      await this.profileRepo.save(profile);

      // Create JWT token
      const token = this.createToken(userId, tenant.id, email, 'admin');

      return {
        success: true,
        message: 'User created successfully',
        access_token: token,
        token_type: 'bearer',
        user: {
          id: userId,
          email: email,
          name: name || email.split('@')[0],
        },
      };
    } catch (error) {
      console.error('Signup error:', error.message);
      throw new Error(error.message || 'Signup failed');
    }
  }

  async signIn(email: string, password: string) {
    try {
      // Find user by email
      const user = await this.profileRepo.findOne({ where: { email: email.toLowerCase() } });
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Verify password
      if (!this.verifyPassword(password, user.passwordHash)) {
        throw new Error('Invalid email or password');
      }

      // Create JWT token
      const token = this.createToken(user.id, user.tenantId, user.email, user.role || 'member');

      return {
        success: true,
        message: 'Signed in successfully',
        access_token: token,
        token_type: 'bearer',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      };
    } catch (error) {
      console.error('Signin error:', error.message);
      throw new Error(error.message || 'Signin failed');
    }
  }

  async getMe(token: string) {
    try {
      const payload = jwt.verify(token, this.secretKey, { algorithms: [this.algorithm] }) as any;
      
      const profile = await this.profileRepo.findOne({ where: { id: payload.sub } });
      if (!profile) {
        throw new Error('Profile not found');
      }

      const tenant = await this.tenantRepo.findOne({ where: { id: payload.tenant_id } });

      return {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        tenant_id: payload.tenant_id,
        tenant: tenant,
        profile: profile,
      };
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  async updateProfile(token: string, update: { name?: string; avatar_url?: string; bio?: string }) {
    try {
      const payload = jwt.verify(token, this.secretKey, { algorithms: [this.algorithm] }) as any;
      
      const profile = await this.profileRepo.findOne({ where: { id: payload.sub } });
      if (!profile) {
        throw new Error('Profile not found');
      }

      if (update.name) profile.name = update.name;
      if (update.avatar_url) profile.avatarUrl = update.avatar_url;
      if (update.bio) profile.bio = update.bio;

      await this.profileRepo.save(profile);

      return { success: true, profile };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  getGoogleAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.googleClientId,
      redirect_uri: this.googleRedirectUri,
      response_type: 'code',
      scope: this.GOOGLE_SCOPES,
      access_type: 'online',
      prompt: 'consent',
    });

    return `${this.GOOGLE_AUTH_URL}?${params.toString()}`;
  }

  async handleGoogleCallback(code: string) {
    // Exchange code for tokens
    const tokenResponse = await fetch(this.GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: this.googleClientId,
        client_secret: this.googleClientSecret,
        redirect_uri: this.googleRedirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for tokens');
    }

    const tokenData = await tokenResponse.json();

    // Get user info from Google
    const userResponse = await fetch(this.GOOGLE_USERINFO_URL, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to get user info from Google');
    }

    const googleUser = await userResponse.json();

    const email = googleUser.email;
    const name = googleUser.name || email.split('@')[0];

    // Find or create user in database
    let profile = await this.profileRepo.findOne({ where: { email: email.toLowerCase() } });

    let userId: string;
    let tenantId: string;

    if (profile) {
      userId = profile.id;
      tenantId = profile.tenantId;
    } else {
      // Create new user
      userId = uuidv4();

      // Get or create default tenant
      let tenant = await this.tenantRepo.findOne({ where: { slug: 'default' } });
      if (!tenant) {
        tenant = await this.tenantRepo.save({
          name: 'Default Team',
          slug: 'default',
          plan: 'free',
          creditsMonthly: 2500,
          maxUsers: 5,
          maxInvestigations: 50,
        });
      }
      tenantId = tenant.id;

      // Create profile
      profile = this.profileRepo.create({
        id: userId,
        tenantId: tenantId,
        email: email.toLowerCase(),
        passwordHash: 'google_oauth',
        name: name,
        role: 'admin',
      });
      await this.profileRepo.save(profile);
    }

    // Generate JWT token
    const accessToken = this.createToken(userId, tenantId, email.toLowerCase(), 'admin');

    return {
      access_token: accessToken,
      email: email,
      name: name,
    };
  }
}