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

@Controller(ApiV2Constant.PAYROLL)
@UseGuards(JwtAuthGuard, ApiKeyGuard, RolesGuard)
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Post()
  create(@ReqProfile() user: ProfileEntity, @Body() body: CreatePayrollDto) {
    return this.payrollService.create(user, body);
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
    @Query("skip") skip: number,
    @Query("take") take: number,
    @Query("employeeId") employeeId: number,
    @Query("name") name: string,
    @Query("branch") branch: string,
    @Query("position") position: string,
    @Query("createdAt", ParseDatetimePipe) createdAt: any,
    @Query("isConfirm") isConfirm: number,
    @Query("isPaid") isPaid: number,
    @Query("isTimeSheet") isTimeSheet: boolean,
    @Query("employeeType") employeeType: EmployeeType,
  ) {
    return this.payrollService.findAll(profile, +skip, +take, {
      employeeId: +employeeId,
      name,
      branch,
      position,
      createdAt,
      isConfirm,
      isPaid,
      employeeType,
      isTimeSheet: Boolean(isTimeSheet)
    });
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.payrollService.findOne(+id);
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Get("/overtime/filter")
  filterOvertime(
    @ReqProfile() profile: ProfileEntity,
    @Query("startAt", ParseDatetimePipe) startAt: any,
    @Query("endAt", ParseDatetimePipe) endAt: any,
    @Query("title") title: string,
    @Query("name") name: string,
  ) {
    return this.payrollService.filterOvertime(profile, {startAt, endAt, title, name});
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
  @Delete(":id")
  remove(@Param("id") id: number) {
    return this.payrollService.remove(+id);
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Get("/:id/payslip")
  async confirmPayslip(@Param("id") id: number) {
    return await this.payrollService.confirmPayslip(+id);
  }

  // export
  @Roles(RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Get("timekeeping/export/print")
  async exportTimeSheet(
    @Res() res,
    @ReqProfile() profile: ProfileEntity,
    @Query("filename") filename: string,
    @Query("datetime", ParseDatetimePipe) datetime: any,
  ) {
    return await this.payrollService.exportTimeSheet(res, profile, datetime);
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Get("/export/print")
  async export(
    @Res() res,
    @ReqProfile() user: ProfileEntity,
    @Query("filename") filename: string,
    @Query("datetime", ParseDatetimePipe) datetime: any,
  ) {
    return this.payrollService.export(res, user, filename, datetime);
  }

  // async exportTimesheet(
  //   @Res() res,
  //   @ReqProfile() profile: ProfileEntity,
  //   @Query("filename") filename: string,
  //   @Query("datetime", ParseDatetimePipe) datetime: any,
  // ) {
  //   return this.payrollService.exportTimesheet(res, profile, filename, datetime);
  // }
}
