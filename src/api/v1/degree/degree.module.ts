import {Module} from '@nestjs/common';
import {DegreeService} from './degree.service';
import {DegreeController} from './degree.controller';
import {PrismaService} from "../../../prisma.service";
import {EmployeeService} from "../employee/employee.service";
import {EmployeeModule} from "../employee/employee.module";
import {EmployeeRepository} from "../employee/employee.repository";

@Module({
  imports: [EmployeeModule],
  controllers: [DegreeController],
  providers: [PrismaService, DegreeService, EmployeeService, EmployeeRepository]
})
export class DegreeModule {
}
