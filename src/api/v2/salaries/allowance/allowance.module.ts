import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import {AllowanceService} from './allowance.service';
import {AllowanceController} from './allowance.controller';
import {AllowanceRepository} from "./allowance.repository";
import {PrismaService} from "../../../../prisma.service";
import {ConfigModule} from "../../../../core/config/config.module";
import {AllowanceMiddleware} from "./allowance.middleware";

@Module({
  imports: [ConfigModule],
  controllers: [AllowanceController],
  providers: [AllowanceService, AllowanceRepository, PrismaService]
})
export class AllowanceModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AllowanceMiddleware)
      .forRoutes({path: "v2/salary/allowance/*", method: RequestMethod.POST});
  }
}
