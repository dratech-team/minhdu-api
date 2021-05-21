import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseBoolPipe,
  UsePipes,
  ValidationPipe, ParseIntPipe
} from '@nestjs/common';
import {PayrollService} from './payroll.service';
import {CreatePayrollDto} from './dto/create-payroll.dto';
import {UpdatePayrollDto} from './dto/update-payroll.dto';
import {UpdateSalaryPayrollDto} from "./dto/update-salary-payroll.dto";

@Controller('v2/payroll')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {
  }

  @Get()
  findAll() {
    return this.payrollService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.payrollService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updatePayrollDto: UpdatePayrollDto
  ) {
    return this.payrollService.update(+id, updatePayrollDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.payrollService.remove(+id);
  }
}
