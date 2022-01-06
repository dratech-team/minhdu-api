import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WarehourseTypeService } from './warehourse-type.service';
import { CreateWarehourseTypeDto } from './dto/create-warehourse-type.dto';
import { UpdateWarehourseTypeDto } from './dto/update-warehourse-type.dto';

@Controller('warehourse-type')
export class WarehourseTypeController {
  constructor(private readonly warehourseTypeService: WarehourseTypeService) {}

  @Post()
  create(@Body() createWarehourseTypeDto: CreateWarehourseTypeDto) {
    return this.warehourseTypeService.create(createWarehourseTypeDto);
  }

  @Get()
  findAll() {
    return this.warehourseTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.warehourseTypeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWarehourseTypeDto: UpdateWarehourseTypeDto) {
    return this.warehourseTypeService.update(+id, updateWarehourseTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.warehourseTypeService.remove(+id);
  }
}
