import { Controller, Post, Get, Put, Body, Headers, Query, Res, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() body: { email: string; password: string; name?: string }) {
    if (!body.email || !body.password) {
      throw new BadRequestException('Email and password are required');
    }
    return this.authService.signUp(body.email, body.password, body.name);
  }

  @Post('signin')
  async signIn(@Body() body: { email: string; password: string }) {
    if (!body.email || !body.password) {
      throw new BadRequestException('Email and password are required');
    }
    return this.authService.signIn(body.email, body.password);
  }

  @Get('me')
  async getMe(@Headers('authorization') authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization required');
    }
    const token = authHeader.substring(7);
    return this.authService.getMe(token);
  }

  @Post('signout')
  async signOut() {
    return { success: true, message: 'Signed out' };
  }

  @Put('profile')
  async updateProfile(
    @Headers('authorization') authHeader: string,
    @Body() body: { name?: string; avatar_url?: string; bio?: string },
  ) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization required');
    }
    const token = authHeader.substring(7);
    return this.authService.updateProfile(token, body);
  }

  @Get('google')
  async googleLogin(@Res() res: Response) {
    const authUrl = this.authService.getGoogleAuthUrl();
    res.redirect(authUrl);
  }

  @Get('google/callback')
  async googleCallback(@Query('code') code: string, @Res() res: Response) {
    if (!code) {
      return res.redirect('http://localhost:3000/login?error=google_no_code');
    }

    try {
      const result = await this.authService.handleGoogleCallback(code);
      
      // Redirect to frontend with token
      const redirectUrl = `http://localhost:3000/login?token=${result.access_token}&email=${encodeURIComponent(result.email)}&name=${encodeURIComponent(result.name)}`;
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('Google OAuth error:', error);
      res.redirect('http://localhost:3000/login?error=google_auth_failed');
    }
  }
}