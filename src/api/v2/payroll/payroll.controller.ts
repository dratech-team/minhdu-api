import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from "@nestjs/common";
import { PayrollService } from "./payroll.service";
import { UpdatePayrollDto } from "./dto/update-payroll.dto";
import { ReqProfile } from "../../../core/decorators/req-profile.decorator";
import { CreatePayrollDto } from "./dto/create-payroll.dto";
import { ApiV2Constant } from "../../../common/constant/api.constant";
import { ParseDatetimePipe } from "src/core/pipe/datetime.pipe";
import { RolesGuard } from "../../../core/guard/role.guard";
import { LoggerGuard } from "../../../core/guard/logger.guard";
import { ProfileEntity } from "../../../common/entities/profile.entity";
import { ApiKeyGuard } from "../../../core/guard/api-key-auth.guard";
import { JwtAuthGuard } from "../../../core/guard/jwt-auth.guard";
import { Role } from "@prisma/client";
import { Roles } from "../../../core/decorators/roles.decorator";

@Controller(ApiV2Constant.PAYROLL)
@UseGuards(JwtAuthGuard, ApiKeyGuard, RolesGuard)
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @UseGuards(LoggerGuard)
  @Roles(Role.ADMIN, Role.HUMAN_RESOURCE, Role.CAMP_ACCOUNTING)
  @Post()
  create(@Body() body: CreatePayrollDto) {
    return this.payrollService.create(body);
  }

  @Get()
  @Roles(
    Role.ADMIN,
    Role.HUMAN_RESOURCE,
    Role.CAMP_ACCOUNTING,
    Role.ACCOUNTANT_CASH_FUND
  )
  findAll(
    @ReqProfile() user: ProfileEntity,
    @Query("skip") skip: number,
    @Query("take") take: number,
    @Query("name") name: string,
    @Query("branch") branch: string,
    @Query("position") position: string,
    @Query("createdAt", ParseDatetimePipe) createdAt: any,
    @Query("isConfirm") isConfirm: number,
    @Query("isPaid") isPaid: number
  ) {
    return this.payrollService.findAll(user, +skip, +take, {
      name,
      branch,
      position,
      createdAt,
      isConfirm,
      isPaid,
    });
  }

  @Roles(Role.ADMIN, Role.HUMAN_RESOURCE, Role.CAMP_ACCOUNTING)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.payrollService.findOne(+id);
  }

  @UseGuards(LoggerGuard)
  @Roles(Role.ADMIN, Role.HUMAN_RESOURCE, Role.CAMP_ACCOUNTING)
  @Patch(":id")
  update(@Param("id") id: number, @Body() updatePayrollDto: UpdatePayrollDto) {
    return this.payrollService.update(+id, updatePayrollDto);
  }

  @UseGuards(LoggerGuard)
  @Roles(
    Role.ADMIN,
    Role.HUMAN_RESOURCE,
    Role.CAMP_ACCOUNTING,
    Role.ACCOUNTANT_CASH_FUND
  )
  @Patch("confirm/:id")
  confirm(@ReqProfile() user: ProfileEntity, @Param("id") id: number) {
    return this.payrollService.confirmPayroll(user, +id);
  }

  @UseGuards(LoggerGuard)
  @Delete(":id")
  remove(@Param("id") id: number) {
    return this.payrollService.remove(+id);
  }

  @Roles(Role.ADMIN, Role.HUMAN_RESOURCE, Role.CAMP_ACCOUNTING)
  @Get("/export/print")
  export(@Res() res, @ReqProfile() user: ProfileEntity) {
    return this.payrollService.export(res, user);
  }

  @Roles(Role.ADMIN, Role.HUMAN_RESOURCE, Role.CAMP_ACCOUNTING)
  @Get("/:id/payslip")
  async payslip(@Param("id") id: number) {
    return await this.payrollService.payslip(+id);
  }
}
