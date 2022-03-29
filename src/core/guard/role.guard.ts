import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {Role} from "@prisma/client";
import {PrismaService} from "../../prisma.service";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly prisma: PrismaService) {
  }

  async canActivate(context: ExecutionContext,): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const roles = this.reflector.get('roles', context.getHandler()) || [];
    const validRole = this.validateRolesRequest(request, roles);
    const validSession = await this.validateSessionReq(request);
    if (!validSession) {
      throw new UnauthorizedException("Có tài khoản khác đã đăng nhập vào máy của bạn.. ");
    }
    return validRole === validSession;
  }

  validateRolesRequest(request, roles: Role[]): boolean {
    return roles.includes(request?.user?.role);
  }

  async validateSessionReq(request): Promise<boolean> {
    const acc = await this.prisma.account.findUnique({where: {id: request.user.id}});
    return request.headers.authorization === acc.token;
  }
}
