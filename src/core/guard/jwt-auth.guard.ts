import {ExecutionContext, Injectable, UnauthorizedException,} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";

/**
 * JwtStrategy
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: any, status?: any) {
    /// TODO: check exp token
    // if (!moment(new Date()).isBefore(new Date(user.exp))) {
    //   throw new UnauthorizedException();
    // }
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
