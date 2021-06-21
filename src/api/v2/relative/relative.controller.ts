import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RelativeService } from './relative.service';
import { CreateRelativeDto } from './dto/create-relative.dto';
import { UpdateRelativeDto } from './dto/update-relative.dto';

@Controller('v2/relative')
export class RelativeController {
  constructor(private readonly relativeService: RelativeService) {}

  @Post()
  create(@Body() createRelativeDto: CreateRelativeDto) {
    return this.relativeService.create(createRelativeDto);
  }

  @Get()
  findAll() {
    return this.relativeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.relativeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRelativeDto: UpdateRelativeDto) {
    return this.relativeService.update(+id, updateRelativeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.relativeService.remove(+id);
  }
}
