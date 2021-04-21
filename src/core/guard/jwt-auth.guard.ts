import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {AuthGuard} from "@nestjs/passport";
import {IProfile} from "../interfaces/profile.interface";
import {UserType} from "../constants/role-type.constant";
import {ERROR_CODE} from "../constants/error.constant";

/**
 * JwtStrategy
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(
    private readonly reflector: Reflector,
    // private readonly errorService: ErrorService
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const shouldActive = await super.canActivate(context);

    if (!shouldActive) {
      console.log('Không tìm thấy tài nguyên. Vui lòng kiểm tra lại!');
      return false;
    }

    const req = context.switchToHttp().getRequest();
    const profile: IProfile = req.user;

    const userTypes = this.getUserTypes(context);
    if (userTypes?.length) {
      if (!userTypes.includes(profile?.user?.userType)) {
        console.log(profile?.user?.userType);
        return false;
      }
    }

    return true;
  }

  getUserTypes(context: ExecutionContext) {
    return this.reflector.get<UserType[]>("roles", context.getHandler());
  }

  // Todo: errorService here
  handleRequest(err: HttpException, user, info: Error) {
    if (info) {
      if (info.name === "TokenExpiredError") {
        throw new HttpException(
          {
            message: "Token expired",
            statusCode: ERROR_CODE.TOKEN_EXPIRED,
          },
          HttpStatus.BAD_REQUEST
        );
      }
      if (info.message) {
        throw new HttpException(
          {
            message: "Forbidden",
            statusCode: ERROR_CODE.FORBIDDEN,
          },
          HttpStatus.FORBIDDEN
        );
      }
    }

    if (err || !user) {
      throw err;
    }

    return user;
  }
}
