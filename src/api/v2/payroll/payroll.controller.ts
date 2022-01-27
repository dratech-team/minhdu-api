import {Body, Controller, Delete, Get, Param, Patch, Post, Query, Res, UseGuards,} from "@nestjs/common";
import {PayrollService} from "./payroll.service";
import {UpdatePayrollDto} from "./dto/update-payroll.dto";
import {ReqProfile} from "../../../core/decorators/req-profile.decorator";
import {CreatePayrollDto} from "./dto/create-payroll.dto";
import {ApiV2Constant} from "../../../common/constant/api.constant";
import {ParseDatetimePipe} from "src/core/pipe/datetime.pipe";
import {RolesGuard} from "../../../core/guard/role.guard";
import {LoggerGuard} from "../../../core/guard/logger.guard";
import {ProfileEntity} from "../../../common/entities/profile.entity";
import {ApiKeyGuard} from "../../../core/guard/api-key-auth.guard";
import {JwtAuthGuard} from "../../../core/guard/jwt-auth.guard";
import {EmployeeType, RoleEnum} from "@prisma/client";
import {Roles} from "../../../core/decorators/roles.decorator";
import {ConfirmPayrollDto} from "./dto/confirm-payroll.dto";
import {FilterTypeEnum} from "./entities/filter-type.enum";
import {ItemExportDto} from "../../../common/interfaces/items-export.dto";
import {SearchPayrollDto} from "./dto/search-payroll.dto";
import {SearchExportDto} from "./dto/search-export.dto";

@Controller(ApiV2Constant.PAYROLL)
@UseGuards(JwtAuthGuard, ApiKeyGuard, RolesGuard)
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Post()
  create(
    @ReqProfile() user: ProfileEntity,
    @Body() body: CreatePayrollDto,
    @Query("employeeType") employeeType: EmployeeType
  ) {
    return this.payrollService.create(user, body, employeeType);
  }

  @Get()
  @Roles(
    RoleEnum.ADMIN,
    RoleEnum.HUMAN_RESOURCE,
    RoleEnum.CAMP_ACCOUNTING,
    RoleEnum.CAMP_MANAGER,
    RoleEnum.ACCOUNTANT_CASH_FUND
  )
  findAll(
    @ReqProfile() profile: ProfileEntity,
    @Query() search: SearchPayrollDto) {
    return this.payrollService.findAll(profile, search);
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.payrollService.findOne(+id);
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Patch(":id")
  update(@Param("id") id: number, @Body() updatePayrollDto: UpdatePayrollDto) {
    return this.payrollService.update(+id, updatePayrollDto);
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Get(":id/generate-holiday")
  generateHoliday(@Param("id") id: number) {
    return this.payrollService.generateHoliday(+id);
  }

  @UseGuards(LoggerGuard)
  @Roles(
    RoleEnum.ADMIN,
    RoleEnum.HUMAN_RESOURCE,
    RoleEnum.CAMP_MANAGER,
    RoleEnum.CAMP_ACCOUNTING,
    RoleEnum.ACCOUNTANT_CASH_FUND
  )
  @Patch("confirm/:id")
  confirm(@ReqProfile() user: ProfileEntity, @Param("id") id: number, @Body() body: ConfirmPayrollDto) {
    return this.payrollService.confirmPayroll(user, +id, body);
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.HUMAN_RESOURCE)
  @Patch("restore/:id")
  restorePayslip(@ReqProfile() profile: ProfileEntity, @Param("id") id: number) {
    return this.payrollService.restorePayslip(profile, +id);
  }

  @UseGuards(LoggerGuard)
  @Roles(
    RoleEnum.ADMIN,
    RoleEnum.HUMAN_RESOURCE,
    RoleEnum.CAMP_ACCOUNTING,
    RoleEnum.CAMP_MANAGER,
    RoleEnum.ACCOUNTANT_CASH_FUND
  )
  @Delete(":id")
  remove(@Param("id") id: number) {
    return this.payrollService.remove(+id);
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Get("/:id/payslip")
  async confirmPayslip(@Param("id") id: number) {
    return await this.payrollService.confirmPayslip(+id);
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Post("/export/payroll")
  async export(
    @Res() res,
    @ReqProfile() profile: ProfileEntity,
    @Query() search: SearchExportDto,
    @Body('items') items: ItemExportDto[],
  ) {
    return this.payrollService.export(res, profile, search, items);
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Get("/export/items")
  async itemsExport(@Query("exportType") exportType: FilterTypeEnum) {
    return this.payrollService.itemsExport(exportType);
  }
}
