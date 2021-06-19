import {Module} from '@nestjs/common';
import {EmployeeController} from './employee.controller';
import {PrismaService} from "../../../prisma.service";
import {SalaryModule} from "../salary/salary.module";
import {ConfigModule} from "../../../core/config/config.module";
import {EmployeeRepository} from "./employee.repository";
import {BranchModule} from "../branch/branch.module";
import {BranchRepository} from "../branch/branch.repository";
import {SalaryRepository} from "../salary/salary.repository";
import {EmployeeService} from "./employee.service";
import {PositionModule} from "../position/position.module";

@Module({
  imports: [
    SalaryModule,
    ConfigModule,
    BranchModule,
    PositionModule
  ],
  controllers: [EmployeeController],
  providers: [
    PrismaService,
    EmployeeRepository,
    EmployeeService,
    BranchRepository,
    SalaryRepository
  ],
  exports: [EmployeeService]
})
export class EmployeeModule {
}
