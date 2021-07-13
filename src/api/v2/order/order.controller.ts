import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';
import {OrderService} from './order.service';
import {CreateOrderDto} from './dto/create-order.dto';
import {UpdateOrderDto} from './dto/update-order.dto';
import {PaidEnum} from "./enums/paid.enum";
import {PaymentType} from '@prisma/client';
import {UpdatePaidDto} from "./dto/update-paid.dto";

@Controller('v2/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {
  }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  findAll(
    @Query("skip") skip: number,
    @Query("take") take: number,
    @Query("paidType") paidType?: PaidEnum,
    @Query("customer") customer?: string,
    @Query("payType") payType?: PaymentType,
  ) {
    return this.orderService.findAll(+skip, +take, paidType, customer, payType);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Patch(':id/paid')
  paid(@Param('id') id: string, @Body() updates: UpdatePaidDto) {
    return this.orderService.paid(+id, updates);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
