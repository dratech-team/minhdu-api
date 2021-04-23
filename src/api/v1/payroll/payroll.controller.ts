import {Body, Controller, Post} from "@nestjs/common";
import {PayrollService} from "./payroll.service";
import {CreatePayrollDto} from "./dto/create-payroll.dto";
import {PayrollEntity} from "./entities/payroll.entity";

@Controller("v1/payroll")
export class PayrollController {
  constructor(private readonly salaryService: PayrollService) {
  }

  @Post()
  create(@Body() createSalaryDto: CreatePayrollDto): Promise<PayrollEntity> {
    return this.salaryService.create(createSalaryDto);
  }
}
