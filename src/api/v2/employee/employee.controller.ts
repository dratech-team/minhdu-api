import {Body, Controller, Delete, Get, Param, Patch, Post, Query, Res, UseGuards,} from "@nestjs/common";
import {EmployeeService} from "./employee.service";
import {CreateEmployeeDto} from "./dto/create-employee.dto";
import {Roles} from "../../../core/decorators/roles.decorator";
import {ReqProfile} from "../../../core/decorators/req-profile.decorator";
import {Sort, UpdateEmployeeDto} from "./dto/update-employee.dto";
import {ApiV2Constant} from "../../../common/constant/api.constant";
import {DatetimeUnit, RoleEnum} from "@prisma/client";
import {ParseDatetimePipe} from "../../../core/pipe/datetime.pipe";
import {JwtAuthGuard} from "../../../core/guard/jwt-auth.guard";
import {ApiKeyGuard} from "../../../core/guard/api-key-auth.guard";
import {RolesGuard} from "../../../core/guard/role.guard";
import {LoggerGuard} from "../../../core/guard/logger.guard";
import {ProfileEntity} from "../../../common/entities/profile.entity";
import {SearchEmployeeDto} from "./dto/search-employee.dto";
import {ItemExportDto} from "../../../common/interfaces/items-export.dto";
import {SearchExportEmployeeDto} from "./dto/search-export.employee.dto";

@UseGuards(JwtAuthGuard, ApiKeyGuard, RolesGuard)
@Controller(ApiV2Constant.EMPLOYEE)
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Post()
  create(
    @ReqProfile() profile: ProfileEntity,
    @Body() createEmployeeDto: CreateEmployeeDto
  ) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Get()
  findAll(
    @ReqProfile() profile: ProfileEntity,
    @Query() search: SearchEmployeeDto
  ) {
    return this.employeeService.findAll(profile, search);
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Get('/salary/overtime')
  async findEmployeeByOvertime(
    @ReqProfile() profile: ProfileEntity,
    @Query("title") title: string,
    @Query("datetime", ParseDatetimePipe) datetime: any,
    @Query("unit") unit: DatetimeUnit,
    @Query("times") times: number,
  ) {
    return await this.employeeService.findEmployeesByOvertime(profile, {title, datetime, unit, times: +times});
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Get(":id")
  findOne(@Param("id") id: number) {
    return this.employeeService.findOne(+id);
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Patch(":id")
  update(
    @Param("id") id: number,
    @Body() updateEmployeeDto: UpdateEmployeeDto
  ) {
    return this.employeeService.update(+id, updateEmployeeDto);
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Patch(":id/leave")
  leave(@Param("id") id: number, @Body("leftAt", ParseDatetimePipe) leftAt: any) {
    return this.employeeService.leave(+id, leftAt);
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Delete(":id")
  remove(@Param("id") id: number) {
    return this.employeeService.remove(+id);
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Delete(":id/work-history")
  removeWorkHistory(@Param("id") id: number) {
    return this.employeeService.remove(+id, true);
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Patch("sort/stt")
  sortable(@Body("sort") sort: Sort[]) {
    return this.employeeService.sortable(sort);
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Post("/export/payroll")
  async export(
    @Res() res,
    @ReqProfile() profile: ProfileEntity,
    @Query() search: SearchExportEmployeeDto,
    @Body('items') items: ItemExportDto[],
  ) {
    return this.employeeService.export(res, profile, search, items);
  }
}
