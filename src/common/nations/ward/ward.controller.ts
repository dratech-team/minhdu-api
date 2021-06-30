import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WardService } from './ward.service';
import { CreateWardDto } from './dto/create-ward.dto';
import { UpdateWardDto } from './dto/update-ward.dto';

@Controller('v2/ward')
export class WardController {
  constructor(private readonly wardService: WardService) {}

  @Post()
  create(@Body() createWardDto: CreateWardDto) {
    return this.wardService.create(createWardDto);
  }

  @Get()
  findAll() {
    return this.wardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wardService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWardDto: UpdateWardDto) {
    return this.wardService.update(+id, updateWardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wardService.remove(+id);
  }
}
