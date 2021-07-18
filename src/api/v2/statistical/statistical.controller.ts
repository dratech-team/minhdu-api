import {Body, Controller, Delete, Get, Param, Patch, Query} from '@nestjs/common';
import {StatisticalService} from './statistical.service';
import {UpdateStatisticalDto} from './dto/update-statistical.dto';
import {NationType} from "./enums/nation-type.enum";

@Controller('v2/statistical')
export class StatisticalController {
  constructor(private readonly statisticalService: StatisticalService) {
  }

  @Get('nation')
  statisticalOrders(
    @Query('startedAt') startedAt: Date,
    @Query('endedAt') endedAt: Date,
    @Query('type') type: NationType,
  ) {
    return this.statisticalService.statisticalNation(new Date(startedAt), new Date(endedAt), type);
  }

  @Get('customers')
  statisticalCustomers() {
    return this.statisticalService.statisticalCustomers();
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
