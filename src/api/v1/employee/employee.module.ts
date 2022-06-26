import {Module} from '@nestjs/common';
import {ConfigModule} from "../../../core/config/config.module";
import {PrismaService} from "../../../prisma.service";
import {EmployeeController} from './employee.controller';
import {EmployeeRepository} from "./employee.repository";
import {EmployeeService} from "./employee.service";

@Module({
  imports: [
    ConfigModule,
  ],
  controllers: [EmployeeController],
  providers: [
    PrismaService,
    EmployeeService,
    EmployeeRepository,
  ],
  exports: [EmployeeService]
})
export class EmployeeModule {
}
