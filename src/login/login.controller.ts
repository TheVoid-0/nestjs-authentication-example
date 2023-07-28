import { Response } from 'express';
import { Body, Controller, Get, Post, Query, Render, Res } from '@nestjs/common';
import { LoginService } from './login.service';
import { UserNotActiveError } from './domain/error/user-not-active.error';
import { LoginDto } from './dto/login.dto';
import { Environment } from '../environment';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService, private readonly environment: Environment) {}

  @Post()
  async login(@Res({ passthrough: true }) request: Response, @Body() loginDto: LoginDto) {
    try {
      return await this.loginService.login(loginDto.emailOrMobilePhone, loginDto.password);
    } catch (error) {
      if (error instanceof UserNotActiveError) {
        request.redirect(`${this.environment.API_URL}/users/confirm-account`);
      }

      throw error;
    }
  }

  @Post('forgot-password')
  async forgotPassword(@Body('emailOrMobilePhone') emailOrMobilePhone: string) {
    await this.loginService.forgotPassword(emailOrMobilePhone);

    return {
      message: 'If the email exists, a message will be sent with instructions to reset your password',
    };
  }

  @Get('password-reset')
  @Render('password-reset')
  getPasswordResetPage(@Query('code') code: string) {
    return { title: 'Password Reset', confirmationCode: code, apiUrl: this.environment.API_URL };
  }
}
