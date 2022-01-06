import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WarehourseService } from './warehourse.service';
import { CreateWarehourseDto } from './dto/create-warehourse.dto';
import { UpdateWarehourseDto } from './dto/update-warehourse.dto';

@Controller('warehourse')
export class WarehourseController {
  constructor(private readonly warehourseService: WarehourseService) {}

  @Post()
  create(@Body() createWarehourseDto: CreateWarehourseDto) {
    return this.warehourseService.create(createWarehourseDto);
  }

  @Get()
  findAll() {
    return this.warehourseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.warehourseService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWarehourseDto: UpdateWarehourseDto) {
    return this.warehourseService.update(+id, updateWarehourseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.warehourseService.remove(+id);
  }
}
