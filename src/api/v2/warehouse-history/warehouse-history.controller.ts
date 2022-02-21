import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';
import {WarehouseHistoryService} from './warehouse-history.service';
import {CreateWarehouseHistoryDto} from './dto/create-warehouse-history.dto';
import {UpdateWarehouseHistoryDto} from './dto/update-warehouse-history.dto';
import {SearchWarehouseHistoryDto} from "./dto/search-warehouse-history.dto";

@Controller('v2/warehouse-history')
export class WarehouseHistoryController {
  constructor(private readonly importExportService: WarehouseHistoryService) {
  }

  @Post()
  create(@Body() createImportExportDto: CreateWarehouseHistoryDto) {
    return this.importExportService.create(createImportExportDto);
  }

  @Get()
  findAll(@Query() search: SearchWarehouseHistoryDto) {
    return this.importExportService.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.importExportService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateImportExportDto: UpdateWarehouseHistoryDto) {
    return this.importExportService.update(+id, updateImportExportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.importExportService.remove(+id);
  }
}
