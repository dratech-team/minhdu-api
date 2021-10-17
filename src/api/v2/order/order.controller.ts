import {Body, Controller, Delete, Get, Param, ParseBoolPipe, Patch, Post, Query, Res, UseGuards,} from "@nestjs/common";
import {OrderService} from "./order.service";
import {CreateOrderDto} from "./dto/create-order.dto";
import {UpdateOrderDto} from "./dto/update-order.dto";
import {PaidEnum} from "./enums/paid.enum";
import {PaymentType, RoleEnum} from "@prisma/client";
import {CustomParseBooleanPipe} from "../../../core/pipe/custom-boolean.pipe";
import {JwtAuthGuard} from "../../../core/guard/jwt-auth.guard";
import {ApiKeyGuard} from "../../../core/guard/api-key-auth.guard";
import {RolesGuard} from "../../../core/guard/role.guard";
import {Roles} from "../../../core/decorators/roles.decorator";
import {LoggerGuard} from "../../../core/guard/logger.guard";
import {ApiV2Constant} from "../../../common/constant/api.constant";

@UseGuards(JwtAuthGuard, ApiKeyGuard)
@Controller(ApiV2Constant.ORDER)
export class OrderController {
  constructor(private readonly orderService: OrderService) {
  }

  @UseGuards(RolesGuard, LoggerGuard)
  @Roles(RoleEnum.ADMIN)
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
      {paidType, customerId: +customerId, customer, payType, delivered: +delivered},
    );
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.orderService.findOne(+id);
  }

  @UseGuards(RolesGuard, LoggerGuard)
  @Roles(RoleEnum.ADMIN)
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @UseGuards(RolesGuard, LoggerGuard)
  @Roles(RoleEnum.ADMIN)
  @Patch("hide/:id")
  updateHide(@Param("id") id: string, @Body("hide", ParseBoolPipe) hide: boolean) {
    return this.orderService.updateHide(+id, hide);
  }

  @UseGuards(RolesGuard, LoggerGuard)
  @Roles(RoleEnum.ADMIN)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.orderService.remove(+id);
  }

  @Get("/export/print")
  async print(@Res() res) {
    return this.orderService.export(res);
  }
}
