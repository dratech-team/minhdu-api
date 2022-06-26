import {Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards} from "@nestjs/common";
import {UpdatePaymentHistoryDto} from "./dto/update-payment-history.dto";
import {PaymentHistoryService} from "./payment-history.service";
import {ApiKeyGuard, JwtAuthGuard, LoggerGuard, RolesGuard} from "../../../../core/guard";
import {Roles} from "../../../../core/decorators/roles.decorator";
import {RoleEnum} from "@prisma/client";
import {CreatePaymentHistoryDto} from "./dto/create-payment-history.dto";
import {ApiConstant} from "../../../../common/constant";

@UseGuards(JwtAuthGuard, ApiKeyGuard, RolesGuard)
@Controller(ApiConstant.V1.PAYMENT_HISTORY)
export class PaymentHistoryController {
  constructor(private readonly paymentHistoryService: PaymentHistoryService) {
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.SALESMAN)
  @Post()
  create(@Body() body: CreatePaymentHistoryDto) {
    return this.paymentHistoryService.create(body);
  }

  @Roles(RoleEnum.SALESMAN)
  @Get()
  findAll(
    @Query("customerId") customerId: number,
    @Query("skip") skip: number,
    @Query("take") take: number
  ) {
    return this.paymentHistoryService.findAll(+customerId, +skip, +take);
  }

  @Roles(RoleEnum.SALESMAN)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.paymentHistoryService.findOne(+id);
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.SALESMAN)
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updatePaymentHistoryDto: UpdatePaymentHistoryDto
  ) {
    return this.paymentHistoryService.update(+id, updatePaymentHistoryDto);
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.SALESMAN)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.paymentHistoryService.remove(+id);
  }
}
