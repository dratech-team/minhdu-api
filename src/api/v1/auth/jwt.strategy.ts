import {Strategy} from 'passport-jwt';
import {PassportStrategy} from '@nestjs/passport';
import {Injectable} from '@nestjs/common';
import {ConfigService} from "../../../core/config/config.service";
import {JwtPayload} from "./interface/jwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
  ) {
    super(configService.jwtStrategyOpts);
  }

  async validate(payload: JwtPayload) {
    return {
      accountId: payload.accountId,
      username: payload.username,
      role: payload.role,
      userId: payload.userId,
    };
  }
}
