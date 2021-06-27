import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SystemHistoryService } from './system-history.service';
import { CreateSystemHistoryDto } from './dto/create-system-history.dto';
import { UpdateSystemHistoryDto } from './dto/update-system-history.dto';

@Controller('system-history')
export class SystemHistoryController {
  constructor(private readonly systemHistoryService: SystemHistoryService) {}

  @Post()
  create(@Body() createSystemHistoryDto: CreateSystemHistoryDto) {
    return this.systemHistoryService.create(createSystemHistoryDto);
  }

  @Get()
  findAll() {
    return this.systemHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.systemHistoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSystemHistoryDto: UpdateSystemHistoryDto) {
    return this.systemHistoryService.update(+id, updateSystemHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.systemHistoryService.remove(+id);
  }
}
