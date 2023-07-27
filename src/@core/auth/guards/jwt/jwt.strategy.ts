import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { Environment } from '../../../../environment';
import { JWT } from './jwt';
import { JwtData } from './jwt-data';
import { ObjectMapper } from '../../../object-mapper/object-mapper';

const STRATEGY_NAME = 'jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, STRATEGY_NAME) {
  constructor(environment: Environment, private readonly logger: Logger) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: !environment.JWT_IS_EXPIRATION_IGNORED,
      secretOrKey: environment.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(_: Request, payload: JWT): Promise<JwtData> {
    try {
      const jwtData = await ObjectMapper.toInstance(JwtData, payload.data);

      return jwtData;
    } catch (error) {
      this.logger.error(error);
      throw new ForbiddenException(`jwt payload could not be parsed or it was malformed`);
    }
  }

  static getName(): string {
    return STRATEGY_NAME;
  }
}
