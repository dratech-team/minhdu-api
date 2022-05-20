import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';
import {ExportService} from './export.service';
import {CreateExportDto} from './dto/create-export.dto';
import {UpdateExportDto} from './dto/update-export.dto';
import {ExportTypeEnum} from "./enums/export.emum";

@Controller('v2/export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {
  }

  @Post()
  create(@Body() createExportDto: CreateExportDto) {
    return this.exportService.create(createExportDto);
  }

  @Get()
  findAll(@Query("exportType") type: ExportTypeEnum) {
    return this.exportService.findAll(type);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exportService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExportDto: UpdateExportDto) {
    return this.exportService.update(+id, updateExportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exportService.remove(+id);
  }
}
