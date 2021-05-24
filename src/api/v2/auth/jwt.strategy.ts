import {Strategy} from 'passport-jwt';
import {PassportStrategy} from '@nestjs/passport';
import {Injectable} from '@nestjs/common';
import {ConfigService} from "../../../core/config/config.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
  ) {
    super(configService.jwtStrategyOpts);
  }

  async validate(payload) {
    return {
      id: payload.accountId,
      username: payload.username,
      role: payload.role
    };
  }
}
