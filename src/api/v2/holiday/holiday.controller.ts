import {Controller, Get, Post, Body, Patch, Param, Delete, Query} from '@nestjs/common';
import {HolidayService} from './holiday.service';
import {CreateHolidayDto} from './dto/create-holiday.dto';
import {UpdateHolidayDto} from './dto/update-holiday.dto';
import {ParseDatetimePipe} from "../../../core/pipe/datetime.pipe";

@Controller('v2/holiday')
export class HolidayController {
  constructor(private readonly holidayService: HolidayService) {
  }

  @Post()
  create(@Body() createHolidayDto: CreateHolidayDto) {
    return this.holidayService.create(createHolidayDto);
  }

  @Get()
  findAll(
    @Query("take") take: number,
    @Query("skip") skip: number,
    @Query("name") name: string,
    @Query("datetime", ParseDatetimePipe) datetime: any,
    @Query("rate", ParseDatetimePipe) rate: number,
    @Query("department") department: string,
  ) {
    return this.holidayService.findAll(+take, +skip, {
      name,
      datetime,
      rate: +rate,
      department,
    });
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('name') name: string,
    @Query('branch') branch: string,
    @Query('position') position: string,
    ) {
    return this.holidayService.findOne(+id, {name, branch, position});
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHolidayDto: UpdateHolidayDto) {
    return this.holidayService.update(+id, updateHolidayDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.holidayService.remove(+id);
  }
}
