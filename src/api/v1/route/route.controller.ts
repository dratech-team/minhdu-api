import {Body, Controller, Delete, Get, Param, Patch, Post, Query, Res, UseGuards,} from "@nestjs/common";
import {RouteService} from "./route.service";
import {CreateRouteDto} from "./dto/create-route.dto";
import {UpdateRouteDto} from "./dto/update-route.dto";
import {SearchRouteDto} from "./dto/search-route.dto";
import {ApiKeyGuard, JwtAuthGuard, LoggerGuard, RolesGuard} from "../../../core/guard";
import {Roles} from "../../../core/decorators/roles.decorator";
import {RoleEnum} from "@prisma/client";
import {CancelRouteDto} from "./dto/cancel-route.dto";
import {ApiConstant} from "../../../common/constant";

@UseGuards(JwtAuthGuard, ApiKeyGuard, RolesGuard)
@Controller(ApiConstant.V1.ROUTE)
export class RouteController {
  constructor(private readonly routeService: RouteService) {
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.SALESMAN)
  @Post()
  create(@Body() createRouteDto: CreateRouteDto) {
    return this.routeService.create(createRouteDto);
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.SALESMAN)
  @Get()
  findAll(@Query() search: SearchRouteDto) {
    return this.routeService.findAll(search);
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.SALESMAN)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.routeService.findOne(+id);
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.SALESMAN)
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateRouteDto: UpdateRouteDto) {
    return this.routeService.update(+id, updateRouteDto);
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.SALESMAN)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.routeService.remove(+id);
  }

  @UseGuards(LoggerGuard)
  @Roles(RoleEnum.SALESMAN)
  @Patch(":id/cancel")
  cancel(@Param("id") id: string, @Body() body: CancelRouteDto) {
    return this.routeService.cancel(+id, body);
  }

  @Get("/export/items")
  async items(
    @Res() res,
    // @Query("name") name: string,
    // @Query("startedAt") startedAt: Date,
    // @Query("endedAt") endedAt: Date,
    // @Query("driver") driver: string,
    // @Query("bsx") bsx: string
  ) {
    return this.routeService.export(res);
  }

  @Get("/export/print")
  async print(
    @Res() res,
    // @Query("name") name: string,
    // @Query("startedAt") startedAt: Date,
    // @Query("endedAt") endedAt: Date,
    // @Query("driver") driver: string,
    // @Query("bsx") bsx: string
  ) {
    return this.routeService.export(res);
  }
}
