import { Module } from '@nestjs/common';
import { LoginModule } from './login/login.module';
import { EnvironmentModule } from './@core/environment/environment.module';
import { UserModule } from './user/user.module';
import { ApplicationLoggerModule } from './@core/logger/application-logger.module';
import { AuthModule } from './@core/auth/auth.module';
import { DatabaseModule } from './@core/database/database.module';

@Module({
  imports: [EnvironmentModule, ApplicationLoggerModule, AuthModule, DatabaseModule, LoginModule, UserModule],
})
export class AppModule {}
