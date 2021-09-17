import {Body, Controller, Delete, Get, Param, Patch, Post, Query, Res, UseGuards,} from "@nestjs/common";
import {OrderService} from "./order.service";
import {CreateOrderDto} from "./dto/create-order.dto";
import {UpdateOrderDto} from "./dto/update-order.dto";
import {PaidEnum} from "./enums/paid.enum";
import {PaymentType} from "@prisma/client";
import {CustomParseBooleanPipe} from "../../../core/pipe/custom-boolean.pipe";
import {ReqProfile} from "../../../core/decorators/req-profile.decorator";
import {JwtAuthGuard} from "../../../core/guard/jwt-auth.guard";
import {ApiKeyGuard} from "../../../core/guard/api-key-auth.guard";
import {ProfileEntity} from "../../../common/entities/profile.entity";
import {RolesGuard} from "../../../core/guard/role.guard";
import {Roles} from "../../../core/decorators/roles.decorator";
import {UserType} from "../../../core/constants/role-type.constant";
import {LoggerGuard} from "../../../core/guard/logger.guard";
import {ApiV2Constant} from "../../../common/constant/api.constant";

@UseGuards(JwtAuthGuard, ApiKeyGuard)
@Controller(ApiV2Constant.ORDER)
export class OrderController {
  constructor(private readonly orderService: OrderService) {
  }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  findAll(
    @ReqProfile() profile: ProfileEntity,
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
      profile,
    );
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.orderService.findOne(+id);
  }

  @UseGuards(RolesGuard, LoggerGuard)
  @Roles(UserType.ADMIN, UserType.HUMAN_RESOURCE)
  @Patch(":id")
  update(@ReqProfile() profile: ProfileEntity, @Param("id") id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto, profile);
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
