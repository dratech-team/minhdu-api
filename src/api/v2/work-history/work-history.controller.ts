import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WorkHistoryService } from './work-history.service';
import { CreateWorkHistoryDto } from './dto/create-work-history.dto';
import { UpdateWorkHistoryDto } from './dto/update-work-history.dto';

@Controller('v2/work-history')
export class WorkHistoryController {
  constructor(private readonly workHistoryService: WorkHistoryService) {}

  @Post()
  create(@Body() createWorkHistoryDto: CreateWorkHistoryDto) {
    return this.workHistoryService.create(createWorkHistoryDto);
  }

  // @Get()
  // findAll() {
  //   return this.workHistoryService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workHistoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkHistoryDto: UpdateWorkHistoryDto) {
    return this.workHistoryService.update(+id, updateWorkHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workHistoryService.remove(+id);
  }
}
