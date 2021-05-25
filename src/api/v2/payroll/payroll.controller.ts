import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Query, UseGuards} from '@nestjs/common';
import {PayrollService} from './payroll.service';
import {UpdatePayrollDto} from './dto/update-payroll.dto';
import {JwtAuthGuard} from "../../../core/guard/jwt-auth.guard";
import {ApiKeyGuard} from "../../../core/guard/api-key-auth.guard";
import {RolesGuard} from "../../../core/guard/role.guard";
import {Roles} from "../../../core/decorators/roles.decorator";
import {UserType} from "../../../core/constants/role-type.constant";
import {ReqProfile} from "../../../core/decorators/req-profile.decorator";

@Controller('v2/payroll')
@UseGuards(JwtAuthGuard, ApiKeyGuard, RolesGuard)
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {
  }

  @Get()
  @Roles(UserType.ADMIN, UserType.HUMAN_RESOURCE, UserType.CAMP_ACCOUNTING)
  findAll(
    @ReqProfile() branchId: string,
    @Query("skip", ParseIntPipe) skip: number,
    @Query("take", ParseIntPipe) take: number,
    @Query("search") search: string,
  ) {
    return this.payrollService.findAll(branchId, +skip, +take, search);
  }

  @Roles(UserType.ADMIN, UserType.HUMAN_RESOURCE, UserType.CAMP_ACCOUNTING)
  @Get(':id')
  findOne(@ReqProfile() branchId: string, @Param('id') id: string) {
    return this.payrollService.findOne(+id);
  }

  @Roles(UserType.ADMIN, UserType.HUMAN_RESOURCE, UserType.CAMP_ACCOUNTING)
  @Get('/export/:id')
  exportPayroll(@Param('id') id: string) {
    return this.payrollService.exportPayroll(+id);
  }

  @Patch(':id')
  @Roles(UserType.CAMP_ACCOUNTING)
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
