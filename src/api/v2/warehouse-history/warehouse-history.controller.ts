import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';
import {WarehouseHistoryService} from './warehouse-history.service';
import {UpdateWarehouseHistoryDto} from './dto/update-warehouse-history.dto';
import {SearchWarehouseHistoryDto} from "./dto/search-warehouse-history.dto";
import {InventoryProductDto} from "./dto/inventory-warehouse-history.dto";

@Controller('v2/warehouse-history')
export class WarehouseHistoryController {
  constructor(private readonly service: WarehouseHistoryService) {
  }

  //
  // @Post()
  // create(@Body() createImportExportDto: CreateWarehouseHistoryDto) {
  //   return this.importExportService.create(createImportExportDto);
  // }

  @Get()
  findAll(@Query() search: SearchWarehouseHistoryDto) {
    return this.service.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateImportExportDto: UpdateWarehouseHistoryDto) {
    return this.service.update(+id, updateImportExportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }

  @Post('inventory')
  iventory(@Body('products') products: InventoryProductDto[]) {
    return this.service.create(products.map(product => Object.assign(product, {id: +product.id})));
  }
}
