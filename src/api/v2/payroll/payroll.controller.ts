import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';
import {PayrollService} from './payroll.service';
import {UpdatePayrollDto} from './dto/update-payroll.dto';
import {Roles} from "../../../core/decorators/roles.decorator";
import {UserType} from "../../../core/constants/role-type.constant";
import {ReqProfile} from "../../../core/decorators/req-profile.decorator";
import {CreatePayrollDto} from "./dto/create-payroll.dto";
import {ApiV2Constant} from "../../../common/constant/api.constant";

@Controller(ApiV2Constant.PAYROLL)
// @UseGuards(JwtAuthGuard, ApiKeyGuard, RolesGuard)
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {
  }

  @Roles(UserType.ADMIN, UserType.HUMAN_RESOURCE, UserType.CAMP_ACCOUNTING)
  @Post()
  create(@Body() body: CreatePayrollDto) {
    return this.payrollService.create(body);
  }

  @Get()
  @Roles(UserType.ADMIN, UserType.HUMAN_RESOURCE, UserType.CAMP_ACCOUNTING)
  findAll(
    @ReqProfile() branchId: number,
    @Query("skip") skip: number,
    @Query("take") take: number,
    @Query("code") code: string,
    @Query("name") name: string,
    @Query("branch") branch: string,
    @Query("department") department: string,
    @Query("position") position: string,
    @Query("createdAt") createdAt: Date,
    @Query("isConfirm") isConfirm: number,
    @Query("isPaid") isPaid: number,
  ) {
    return this.payrollService.findAll(branchId, +skip, +take, {
      code,
      name,
      branch,
      department,
      position,
      createdAt,
      isConfirm,
      isPaid
    });
  }

  @Roles(UserType.ADMIN, UserType.HUMAN_RESOURCE, UserType.CAMP_ACCOUNTING)
  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
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
  remove(@Param('id') id: number) {
    return this.payrollService.remove(+id);
  }
}
