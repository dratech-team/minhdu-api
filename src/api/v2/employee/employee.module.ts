import { Module } from '@nestjs/common';
import { BranchModule } from "../../../common/branches/branch/branch.module";
import { BranchRepository } from "../../../common/branches/branch/branch.repository";
import { ConfigModule } from "../../../core/config/config.module";
import { PrismaService } from "../../../prisma.service";
import { EmployeeController } from './employee.controller';
import { EmployeeRepository } from "./employee.repository";
import { EmployeeService } from "./employee.service";

@Module({
  imports: [
    ConfigModule,
    BranchModule,
  ],
  controllers: [EmployeeController],
  providers: [
    PrismaService,
    EmployeeService,
    EmployeeRepository,
    BranchRepository,
  ],
  exports: [EmployeeService]
})
export class EmployeeModule {
}
