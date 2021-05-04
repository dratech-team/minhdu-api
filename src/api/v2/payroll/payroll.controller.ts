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

  @Post(":id")
  updateCreateSalary(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateSalaryPayrollDto: UpdateSalaryPayrollDto
  ) {
    return this.payrollService.updateCreateSalary(+id, updateSalaryPayrollDto);
  }

  /**
   * Tạo phiếu lương mới nếu không còn phiếu lương nào đang trong trạng thái chờ
   * */
  @Post()
  createPayroll(@Body() createPayrollDto: CreatePayrollDto) {
    return this.payrollService.create(createPayrollDto);
  }

  @Get()
  findAll(
    @Query("employeeId") employeeId: string,
    @Query("confirmed", ParseBoolPipe) confirmed: boolean,
    @Query("skip") skip: number,
    @Query("take") take: number,
  ) {
    return this.payrollService.findAll(employeeId, confirmed, +skip, +take);
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

  @Patch('salary/:id')
  updateSalary(
    @Param('id') id: number,
    @Body() updates: UpdateSalaryPayrollDto
  ) {
    return this.payrollService.updateSalary(+id, updates);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.payrollService.remove(+id);
  }
}
