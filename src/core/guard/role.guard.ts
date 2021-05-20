import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {Observable} from "rxjs";
import {Reflector} from "@nestjs/core";
import {UserType} from "../constants/role-type.constant";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const roles = this.reflector.get('roles', context.getHandler()) || [];
    return this.validateRolesRequest(request, roles);
  }

  validateRolesRequest(request, roles: UserType[]): boolean {
    return roles.includes(request?.user?.role);
  }
}
