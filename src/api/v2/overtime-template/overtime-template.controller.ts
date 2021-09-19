import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';
import {OvertimeTemplateService} from './overtime-template.service';
import {CreateOvertimeTemplateDto} from './dto/create-overtime-template.dto';
import {UpdateOvertimeTemplateDto} from './dto/update-overtime-template.dto';
import {ApiV2Constant} from "../../../common/constant/api.constant";
import {SalaryType} from "@prisma/client";

@Controller(ApiV2Constant.OVERTIME_TEMPLATE)
export class OvertimeTemplateController {
  constructor(private readonly service: OvertimeTemplateService) {
  }

  @Post()
  create(@Body() body: CreateOvertimeTemplateDto) {
    return this.service.create(body);
  }

  @Get()
  findAll(
    @Query("take") take: number,
    @Query("skip") skip: number,
    @Query("title") title: string,
    @Query("type") type: SalaryType,
    @Query("price") price: number,
    @Query("branch") branch: string,
  ) {
    return this.service.findAll(+take, +skip, {
      title,
      type,
      price: +price,
      branch,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updates: UpdateOvertimeTemplateDto) {
    return this.service.update(+id, updates);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
