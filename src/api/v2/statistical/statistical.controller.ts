import {Controller, Get, Post, Body, Patch, Param, Delete, Query} from '@nestjs/common';
import {StatisticalService} from './statistical.service';
import {CreateStatisticalDto} from './dto/create-statistical.dto';
import {UpdateStatisticalDto} from './dto/update-statistical.dto';

@Controller('v2/statistical')
export class StatisticalController {
  constructor(private readonly statisticalService: StatisticalService) {
  }

  @Get('orders')
  statisticalOrders(
    @Query('startedAt') startedAt: Date,
    @Query('endedAt') endedAt: Date,
  ) {
    return this.statisticalService.statisticalOrders(new Date(startedAt), new Date(endedAt));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.statisticalService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStatisticalDto: UpdateStatisticalDto) {
    return this.statisticalService.update(+id, updateStatisticalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.statisticalService.remove(+id);
  }
}
