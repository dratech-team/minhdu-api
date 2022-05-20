import {Module} from '@nestjs/common';
import {RelativeService} from './relative.service';
import {RelativeController} from './relative.controller';
import {PrismaService} from "../../../prisma.service";
import {EmployeeModule} from "../employee/employee.module";
import {EmployeeService} from "../employee/employee.service";
import {EmployeeRepository} from "../employee/employee.repository";

@Module({
  imports: [EmployeeModule],
  controllers: [RelativeController],
  providers: [PrismaService, RelativeService, EmployeeService, EmployeeRepository]
})
export class RelativeModule {
}
