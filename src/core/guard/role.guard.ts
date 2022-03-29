import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {Observable} from "rxjs";
import {Reflector} from "@nestjs/core";
import {Role} from "@prisma/client";
import {PrismaService} from "../../prisma.service";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly prisma: PrismaService) {
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const roles = this.reflector.get('roles', context.getHandler()) || [];
    return this.validateRolesRequest(request, roles);
  }

  validateRolesRequest(request, roles: Role[]): boolean {
    return roles.includes(request?.user?.role);
  }
}
