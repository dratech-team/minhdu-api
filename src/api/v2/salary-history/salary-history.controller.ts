import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SalaryHistoryService } from './salary-history.service';
import { CreateSalaryHistoryDto } from './dto/create-salary-history.dto';
import { UpdateSalaryHistoryDto } from './dto/update-salary-history.dto';

@Controller('v2/salary-history')
export class SalaryHistoryController {
  constructor(private readonly salaryHistoryService: SalaryHistoryService) {}

  @Post()
  create(@Body() createSalaryHistoryDto: CreateSalaryHistoryDto) {
    return this.salaryHistoryService.create(createSalaryHistoryDto);
  }

  // @Get()
  // findAll() {
  //   return this.salaryHistoryService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salaryHistoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSalaryHistoryDto: UpdateSalaryHistoryDto) {
    return this.salaryHistoryService.update(+id, updateSalaryHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salaryHistoryService.remove(+id);
  }
}
