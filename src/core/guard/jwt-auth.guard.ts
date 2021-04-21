import {ExecutionContext, Injectable,} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {AuthGuard} from "@nestjs/passport";
import {UserType} from "../constants/role-type.constant";
import {JwtPayload} from "../../api/v1/auth/interface/jwt-payload.interface";

/**
 * JwtStrategy
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(
    private readonly reflector: Reflector,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const shouldActive = await super.canActivate(context);

    if (!shouldActive) {
      return false;
    }

    const req = context.switchToHttp().getRequest();
    const profile: JwtPayload = req.user;

    const userTypes = this.reflector.get<UserType[]>("roles", context.getHandler());
    if (userTypes?.length) {
      if (!userTypes.includes(profile?.role)) {
        return false;
      }
    }
    return true;
  }
}
