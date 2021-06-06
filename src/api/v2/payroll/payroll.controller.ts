import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Res, UseGuards} from '@nestjs/common';
import {PayrollService} from './payroll.service';
import {UpdatePayrollDto} from './dto/update-payroll.dto';
import {Roles} from "../../../core/decorators/roles.decorator";
import {UserType} from "../../../core/constants/role-type.constant";
import {ReqProfile} from "../../../core/decorators/req-profile.decorator";
import {JwtAuthGuard} from "../../../core/guard/jwt-auth.guard";
import {RolesGuard} from "../../../core/guard/role.guard";
import {ApiKeyGuard} from "../../../core/guard/api-key-auth.guard";

@Controller('v2/payroll')
@UseGuards(JwtAuthGuard, ApiKeyGuard, RolesGuard)
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {
  }

  @Post()
  create(@Body() createAt: Date) {
    return this.payrollService.create();
  }

  @Get()
  @Roles(UserType.ADMIN, UserType.HUMAN_RESOURCE, UserType.CAMP_ACCOUNTING)
  findAll(
    @ReqProfile() branchId: number,
    @Query("skip", ParseIntPipe) skip: number,
    @Query("take", ParseIntPipe) take: number,
    @Query("search") search: string,
    @Query("datetime") datetime: Date,
  ) {
    return this.payrollService.findAll(branchId, +skip, +take, search, datetime);
  }

  // @Roles(UserType.ADMIN, UserType.HUMAN_RESOURCE, UserType.CAMP_ACCOUNTING)
  @Get('/export')
  async exportPayrolls(@Res() res, @ReqProfile() branchId: number,) {
    // return await this.payrollService.print(branchId);
    // return res.download(fileName);
    // return this.payrollService.print(branchId);
  }

  @Roles(UserType.ADMIN, UserType.HUMAN_RESOURCE, UserType.CAMP_ACCOUNTING)
  @Get(':id')
  findOne(@ReqProfile() branchId: string, @Param('id') id: string) {
    return this.payrollService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserType.ADMIN, UserType.HUMAN_RESOURCE, UserType.CAMP_ACCOUNTING)
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
