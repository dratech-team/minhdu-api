import {Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import {CreateWarehouseDto} from './dto/create-warehouse.dto';
import {UpdateWarehouseDto} from './dto/update-warehouse.dto';
import {ApiConstant} from "../../../common/constant";
import {WarehouseService} from "./warehouse.service";

@Controller(ApiConstant.V1.WAREHOUSE.WAREHOUSE)
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {
  }

  @Post()
  create(@Body() createWarehouseDto: CreateWarehouseDto) {
    return this.warehouseService.create(createWarehouseDto);
  }

  @Get()
  findAll() {
    return this.warehouseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.warehouseService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWarehouseDto: UpdateWarehouseDto) {
    return this.warehouseService.update(+id, updateWarehouseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.warehouseService.remove(+id);
  }
}
