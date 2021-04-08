import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { ConfigService } from "@/core/config/config.service";
import { IAppRequest } from "@/core/interfaces/app-request.interface";

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  validateRequest(request: IAppRequest): boolean {
    return request?.headers?.["x-api-key"] === this.configService.appApiKey;
  }
}
