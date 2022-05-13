import {Body, Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common';
import {DayoffService} from './dayoff.service';
import {CreateDayoffDto} from './dto/create-dayoff.dto';
import {UpdateDayoffDto} from './dto/update-dayoff.dto';
import {ApiV2Constant} from "../../../../common/constant/api.constant";

@Controller(ApiV2Constant.SALARY.DAYOFF)
export class DayoffController {
  constructor(private readonly dayoffService: DayoffService) {
  }

  @Post()
  create(@Body() createDayoffDto: CreateDayoffDto) {
    return this.dayoffService.create(createDayoffDto);
  }

  @Get()
  findAll() {
    return this.dayoffService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dayoffService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDayoffDto: UpdateDayoffDto) {
    return this.dayoffService.update(+id, updateDayoffDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dayoffService.remove(+id);
  }
}
