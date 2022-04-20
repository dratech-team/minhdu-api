import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AbsentService } from './absent.service';
import { CreateAbsentDto } from './dto/create-absent.dto';
import { UpdateAbsentDto } from './dto/update-absent.dto';

@Controller('salary/absent')
export class AbsentController {
  constructor(private readonly absentService: AbsentService) {}

  @Post()
  create(@Body() createAbsentDto: CreateAbsentDto) {
    return this.absentService.create(createAbsentDto);
  }

  @Get()
  findAll() {
    return this.absentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.absentService.findOne(+id);
  }

  @Post('multiple')
  update(@Body() updateAbsentDto: UpdateAbsentDto) {
    return this.absentService.update(updateAbsentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.absentService.remove(+id);
  }
}
