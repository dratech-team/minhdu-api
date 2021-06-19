import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RelativeService } from './relative.service';
import { CreateRelativeDto } from './dto/create-relative.dto';
import { UpdateRelativeDto } from './dto/update-relative.dto';

@Controller('v2/relative')
export class RelativeController {
  constructor(private readonly familyService: RelativeService) {}

  @Post()
  create(@Body() createFamilyDto: CreateRelativeDto) {
    return this.familyService.create(createFamilyDto);
  }

  // @Get()
  // findAll() {
  //   return this.familyService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.familyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFamilyDto: UpdateRelativeDto) {
    return this.familyService.update(+id, updateFamilyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.familyService.remove(+id);
  }
}
