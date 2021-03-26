import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import { Reflector } from "@nestjs/core";
import { USER_TYPE } from "@/constants/role-type.constant";
import { IAppRequest } from "@/interfaces/app-request.interface";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles =
      this.reflector.get<USER_TYPE[]>("roles", context.getHandler()) || [];
    if (!roles || !roles.length) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    return this.validateRolesRequest(request, roles);
  }

  validateRolesRequest(request: IAppRequest, roles: USER_TYPE[]): boolean {
    return roles.includes(request?.user?.user?.userType);
  }
}
