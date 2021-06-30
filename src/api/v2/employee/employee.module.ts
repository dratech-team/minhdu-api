import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import {EmployeeController} from './employee.controller';
import {PrismaService} from "../../../prisma.service";
import {ConfigModule} from "../../../core/config/config.module";
import {EmployeeRepository} from "./employee.repository";
import {BranchModule} from "../../../common/branches/branch/branch.module";
import {BranchRepository} from "../../../common/branches/branch/branch.repository";
import {EmployeeService} from "./employee.service";
import {PositionModule} from "../../../common/branches/position/position.module";
import {WorkHistoryModule} from "../histories/work-history/work-history.module";
import {WorkHistoryRepository} from "../histories/work-history/work-history.repository";

@Module({
  imports: [
    ConfigModule,
    BranchModule,
    PositionModule,
    WorkHistoryModule,
  ],
  controllers: [EmployeeController],
  providers: [
    PrismaService,
    EmployeeService,
    EmployeeRepository,
    BranchRepository,
    WorkHistoryRepository
  ],
  exports: [EmployeeService]
})
export class EmployeeModule {
}
