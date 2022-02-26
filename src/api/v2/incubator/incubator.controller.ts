import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IncubatorService } from './incubator.service';
import { CreateIncubatorDto } from './dto/create-incubator.dto';
import { UpdateIncubatorDto } from './dto/update-incubator.dto';

@Controller('v2/incubator')
export class IncubatorController {
  constructor(private readonly incubatorService: IncubatorService) {}

  @Post()
  create(@Body() createIncubatorDto: CreateIncubatorDto) {
    return this.incubatorService.create(createIncubatorDto);
  }

  @Get()
  findAll() {
    return this.incubatorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.incubatorService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIncubatorDto: UpdateIncubatorDto) {
    return this.incubatorService.update(+id, updateIncubatorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.incubatorService.remove(+id);
  }
}
