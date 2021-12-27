import {Body, Controller, Delete, Get, Param, Patch, Post, Query, Res,} from "@nestjs/common";
import {RouteService} from "./route.service";
import {CreateRouteDto} from "./dto/create-route.dto";
import {UpdateRouteDto} from "./dto/update-route.dto";
import {ParseDatetimePipe} from "../../../core/pipe/datetime.pipe";
import {SearchRouteDto} from "./dto/search-route.dto";

@Controller("v2/route")
export class RouteController {
  constructor(private readonly routeService: RouteService) {
  }

  @Post()
  create(@Body() createRouteDto: CreateRouteDto) {
    return this.routeService.create(createRouteDto);
  }

  @Get()
  findAll(@Query() search: SearchRouteDto) {
    return this.routeService.findAll(search);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.routeService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateRouteDto: UpdateRouteDto) {
    return this.routeService.update(+id, updateRouteDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.routeService.remove(+id);
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
