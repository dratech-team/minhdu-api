import {Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards} from '@nestjs/common';
import {OrderHistoryService} from './order-history.service';
import {CreateOrderHistoryDto} from './dto/create-order-history.dto';
import {UpdateOrderHistoryDto} from './dto/update-order-history.dto';
import {SearchOrderHistoryDto} from "./dto/search-order-history.dto";
import {ApiConstant} from "../../../../common/constant";
import {ApiKeyGuard, JwtAuthGuard, RolesGuard} from "../../../../core/guard";
import {Roles} from "../../../../core/decorators/roles.decorator";
import {RoleEnum} from "@prisma/client";

@UseGuards(JwtAuthGuard, ApiKeyGuard, RolesGuard)
@Controller(ApiConstant.V1.ORDER_HISTORY)
export class OrderHistoryController {
  constructor(private readonly orderHistoryService: OrderHistoryService) {
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.SALESMAN)
  @Post()
  create(@Body() createOrderHistoryDto: CreateOrderHistoryDto) {
    return this.orderHistoryService.create(createOrderHistoryDto);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.SALESMAN)
  @Get()
  findAll(@Query() search: SearchOrderHistoryDto) {
    return this.orderHistoryService.findAll(search);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.SALESMAN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderHistoryService.findOne(+id);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.SALESMAN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderHistoryDto: UpdateOrderHistoryDto) {
    return this.orderHistoryService.update(+id, updateOrderHistoryDto);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.SALESMAN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderHistoryService.remove(+id);
  }
}
