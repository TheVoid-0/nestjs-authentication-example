import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Environment } from '../../environment';
import { JwtStrategy } from './guards/jwt/jwt.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory(environment: Environment) {
        return {
          secret: environment.JWT_SECRET,
        };
      },
      inject: [Environment],
    }),
  ],
  providers: [JwtStrategy],
  exports: [JwtModule],
})
export class AuthModule {}
