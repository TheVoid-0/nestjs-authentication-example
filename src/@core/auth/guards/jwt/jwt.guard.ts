import { AuthGuard } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

export class JwtGuard extends AuthGuard(JwtStrategy.getName()) {}
