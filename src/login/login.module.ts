import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { AuthModule } from '../@core/auth/auth.module';
import { UserModule } from '../user/user.module';
import { PasswordModule } from '../@core/password/password.module';
import { MailModule } from '../@core/mail/mail.module';

@Module({
  imports: [AuthModule, UserModule, PasswordModule, MailModule],
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}
