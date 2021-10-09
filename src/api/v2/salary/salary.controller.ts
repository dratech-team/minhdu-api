import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query,} from "@nestjs/common";
import {CreateSalaryDto} from "./dto/create-salary.dto";
import {UpdateSalaryDto} from "./dto/update-salary.dto";
import {SalaryService} from "./salary.service";
import {ParseDatetimePipe} from "../../../core/pipe/datetime.pipe";
import {DatetimeUnit} from "@prisma/client";

@Controller("v2/salary")
export class SalaryController {
  constructor(private readonly salaryService: SalaryService) {
  }

  @Post()
  async create(@Body() createSalaryDto: CreateSalaryDto) {
    return await this.salaryService.create(createSalaryDto);
  }

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
    return this.salaryService.findAll(+skip, +take, {
      createdAt, unit, title, position, employeeId: +employeeId
    });
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.salaryService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateSalaryDto: UpdateSalaryDto) {
    return this.salaryService.update(+id, updateSalaryDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.salaryService.remove(+id);
  }
}
