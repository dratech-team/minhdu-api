import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {AppEnum} from "@prisma/client";
import {Observable} from "rxjs";
import {PrismaService} from "../../prisma.service";
import {ApiV2Constant} from "../../common/constant/api.constant";

@Injectable()
export class LoggerGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    let appName: AppEnum = AppEnum.UNKNOWN;


    const request = context.switchToHttp().getRequest();

    const path = request.route.path;
    const method = request.method;
    const body = request.body;

    // path for define app name
    if ((path.includes(ApiV2Constant.ORDER))) {
      appName = AppEnum.SELL;
    } else if ((request.route.path.includes(ApiV2Constant.ORDER))) {

    }

    /// TODO: convert body object to string for save db
    this.prisma.systemHistory.create({
      data: {
        appName: appName,
        name: request.user.username,
        activity: method,
        description: path + " | " + JSON.stringify(body),
        ip: request.socket.remoteAddress,
      }
    }).then();
    return true;
  }
}
