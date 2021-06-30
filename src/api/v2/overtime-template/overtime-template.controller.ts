import {Body, Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common';
import {OvertimeTemplateService} from './overtime-template.service';
import {CreateOvertimeTemplateDto} from './dto/create-overtime-template.dto';
import {UpdateOvertimeTemplateDto} from './dto/update-overtime-template.dto';
import {ApiV2Constant} from "../../../common/constant/api.constant";

@Controller(ApiV2Constant.OVERTIME_TEMPLATE)
export class OvertimeTemplateController {
  constructor(private readonly service: OvertimeTemplateService) {
  }

  @Post()
  create(@Body() body: CreateOvertimeTemplateDto) {
    return this.service.create(body);
  }

  @Get()
  findAll() {
    return this.service.findAll();
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
