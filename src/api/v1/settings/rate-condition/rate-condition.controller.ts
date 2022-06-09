import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';
import {RateConditionService} from './rate-condition.service';
import {CreateRateConditionDto} from './dto/create-rate-condition.dto';
import {UpdateRateConditionDto} from './dto/update-rate-condition.dto';
import {ApiConstant} from "../../../../common/constant";
import {SearchRateConditionDto} from "./dto/search-rate-condition.dto";

@Controller(ApiConstant.V1.SETTINGS.RATE_CONDITION)
export class RateConditionController {
  constructor(private readonly rateConditionService: RateConditionService) {
  }

  @Post()
  create(@Body() createRateConditionDto: CreateRateConditionDto) {
    return this.rateConditionService.create(createRateConditionDto);
  }

  @Get()
  findAll(@Query() search: SearchRateConditionDto) {
    return this.rateConditionService.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rateConditionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRateConditionDto: UpdateRateConditionDto) {
    return this.rateConditionService.update(+id, updateRateConditionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rateConditionService.remove(+id);
  }
}
