import {Body, Controller, Delete, Get, Param, Patch, Post, Query, Res,} from "@nestjs/common";
import {OrderService} from "./order.service";
import {CreateOrderDto} from "./dto/create-order.dto";
import {UpdateOrderDto} from "./dto/update-order.dto";
import {PaidEnum} from "./enums/paid.enum";
import {PaymentType} from "@prisma/client";
import {CustomParseBooleanPipe} from "../../../core/pipe/custom-boolean.pipe";

@Controller("v2/order")
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
    @Query("customerId") customerId?: number,
    @Query("customer") customer?: string,
    @Query("payType") payType?: PaymentType,
    @Query("delivered", CustomParseBooleanPipe) delivered?: any,
  ) {
    return this.orderService.findAll(
      +skip,
      +take,
      {paidType, customerId: +customerId, customer, payType, delivered: +delivered}
    );
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.orderService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.orderService.remove(+id);
  }

  @Get("/export/print")
  async print(@Res() res) {
    return this.orderService.export(res);
  }
}
