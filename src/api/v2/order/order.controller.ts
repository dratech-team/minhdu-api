import {Body, Controller, Delete, Get, Param, ParseBoolPipe, Patch, Post, Query, Res, UseGuards} from "@nestjs/common";
import {OrderService} from "./order.service";
import {CreateOrderDto} from "./dto/create-order.dto";
import {UpdateOrderDto} from "./dto/update-order.dto";
import {RoleEnum} from "@prisma/client";
import {ApiKeyGuard, JwtAuthGuard, LoggerGuard, RolesGuard} from "../../../core/guard";
import {Roles} from "../../../core/decorators/roles.decorator";
import {ApiV2Constant} from "../../../common/constant/api.constant";
import {SearchOrderDto} from "./dto/search-order.dto";
import {ItemExportDto} from "../../../common/interfaces/items-export.dto";

@UseGuards(JwtAuthGuard, ApiKeyGuard, RolesGuard)
@Controller(ApiV2Constant.ORDER)
export class OrderController {
  constructor(private readonly orderService: OrderService) {
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.SALESMAN)
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.ADMIN, RoleEnum.SALESMAN)
  @Get()
  findAll(@Query() search: SearchOrderDto) {
    return this.orderService.findAll(search);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.ADMIN, RoleEnum.SALESMAN)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.orderService.findOne(+id);
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.SALESMAN)
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.SALESMAN)
  @Patch("hide/:id")
  updateHide(@Param("id") id: string, @Body("hide", ParseBoolPipe) hide: boolean) {
    return this.orderService.updateHide(+id, hide);
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.SALESMAN)
  @Delete(":id/cancel")
  cancel(@Param("id") id: string) {
    return this.orderService.remove(+id, true);
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.SALESMAN)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.orderService.remove(+id);
  }

  @Get("/export/items")
  async items() {
    return this.orderService.itemsExport();
  }

  @Get("/export/print")
  async print(@Res() res, @Body('items') items: ItemExportDto[], @Query() search: SearchOrderDto) {
    return this.orderService.export(res, items, search);
  }
}
