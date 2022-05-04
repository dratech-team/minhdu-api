import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards,} from "@nestjs/common";
import {CreateSalaryDto} from "./dto/create-salary.dto";
import {UpdateSalaryDto} from "./dto/update-salary.dto";
import {SalaryService} from "./salary.service";
import {ParseDatetimePipe} from "../../../../core/pipe/datetime.pipe";
import {DatetimeUnit, RoleEnum} from "@prisma/client";
import {ReqProfile} from "../../../../core/decorators/req-profile.decorator";
import {ProfileEntity} from "../../../../common/entities/profile.entity";
import {ApiKeyGuard, JwtAuthGuard, LoggerGuard, RolesGuard} from "../../../../core/guard";
import {Roles} from "../../../../core/decorators/roles.decorator";
import {UpdateManySalaryDto} from "./dto/update-many-salary.dto";
import {ApiV2Constant} from "../../../../common/constant/api.constant";

@UseGuards(JwtAuthGuard, ApiKeyGuard, RolesGuard)
@Controller(ApiV2Constant.SALARY.SALARY)
export class SalaryController {
  constructor(private readonly salaryService: SalaryService) {
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Post()
  async create(@Body() createSalaryDto: CreateSalaryDto) {
    return await this.salaryService.create(createSalaryDto);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING, RoleEnum.HUMAN_RESOURCE, RoleEnum.ADMIN)
  @Get()
  findAll(
    @Query("skip", ParseIntPipe) skip: number,
    @Query("take", ParseIntPipe) take: number,
    @Query("title") title: string,
    @Query("unit") unit: DatetimeUnit,
    @Query("createdAt", ParseDatetimePipe) createdAt: any,
    @Query("position") position: string,
    @Query("employeeId") employeeId: number,
  ) {
    return this.salaryService.findAll({
      createdAt, unit, title, position, employeeId: +employeeId
    });
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING, RoleEnum.HUMAN_RESOURCE, RoleEnum.ADMIN)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.salaryService.findOne(+id);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.CAMP_ACCOUNTING, RoleEnum.HUMAN_RESOURCE)
  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateSalaryDto: UpdateSalaryDto) {
    return await this.salaryService.update(+id, updateSalaryDto);
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Patch("salaries/ids")
  async updateMany(@ReqProfile() profile: ProfileEntity, @Param("id") id: number, @Body() updateSalaryDto: UpdateManySalaryDto) {
    return await this.salaryService.updateMany(profile, +id, updateSalaryDto);
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.salaryService.remove(+id);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Post("/migrate")
  migrate() {
    return this.salaryService.migrate();
  }
}
