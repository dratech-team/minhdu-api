import {Controller, Get, Query} from '@nestjs/common';
import {StatisticalService} from './statistical.service';
import {NationType} from "./enums/nation-type.enum";
import {CustomerType} from "./enums/customer-type.enum";

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

  @Get('customer')
  customers(
    @Query('type') type: CustomerType,
  ) {
    return this.statisticalService.statisticalCustomer(type);
  }

  @Get('route')
  route(
    @Query('type') type: CustomerType,
  ) {
    return this.statisticalService.statisticalCustomer(type);
  }
}
