import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { PasswordService } from '../@core/password/password.service';
import { UserNotActiveError } from './domain/error/user-not-active.error';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../@core/mail/mail.service';
import { Environment } from '../environment';

@Injectable()
export class LoginService {
  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly environment: Environment,
  ) {}

  async login(emailOrMobilePhone: string, password: string) {
    const user = await this.userService.findByEmailOrMobilePhone(emailOrMobilePhone);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordCorrect = await this.passwordService.isPasswordCorrect(password, user.password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UserNotActiveError();
    }

    const tokenPayload = {
      id: user.id,
    };

    const token = this.jwtService.sign(
      { data: tokenPayload },
      {
        expiresIn: '24h',
        issuer: 'API_AUTHENTICATION',
      },
    );

    return { token };
  }

  async forgotPassword(emailOrMobilePhone: string) {
    const user = await this.userService.findByEmailOrMobilePhone(emailOrMobilePhone);

    if (!user) {
      return;
    }

    const confirmationCode = await this.userService.getConfirmationCodeForUser(user);

    await this.mailService.send({
      from: this.environment.SMTP_USER,
      to: [user.email],
      subject: 'Password reset',
      template: `
        <h1>Reset your password</h1>
        
        <p>Click <a href="${this.environment.API_URL}/login/password-reset?code=${confirmationCode}">here</a> to reset your password</p>`,
    });
  }
}
