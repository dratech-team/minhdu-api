import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';
import {OrderHistoryService} from './order-history.service';
import {CreateOrderHistoryDto} from './dto/create-order-history.dto';
import {UpdateOrderHistoryDto} from './dto/update-order-history.dto';
import {SearchOrderHistoryDto} from "./dto/search-order-history.dto";
import {ApiConstant} from "../../../../common/constant";

@Controller(ApiConstant.V1.ORDER_HISTORY)
export class OrderHistoryController {
  constructor(private readonly orderHistoryService: OrderHistoryService) {
  }

  @Post()
  create(@Body() createOrderHistoryDto: CreateOrderHistoryDto) {
    return this.orderHistoryService.create(createOrderHistoryDto);
  }

  @Get()
  findAll(@Query() search: SearchOrderHistoryDto) {
    return this.orderHistoryService.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderHistoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderHistoryDto: UpdateOrderHistoryDto) {
    return this.orderHistoryService.update(+id, updateOrderHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderHistoryService.remove(+id);
  }
}
