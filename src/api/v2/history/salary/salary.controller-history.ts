import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import {CreateSalaryHistoryDto} from "./dto/create-salary-history.dto";
import {UpdateSalaryHistoryDto} from "./dto/update-salary-history.dto";
import {SalaryHistoryService} from "./salary-history.service";

@Controller('v2/history/salary')
export class SalaryControllerHistory {
  constructor(private readonly salaryService: SalaryHistoryService) {}

  @Post()
  create(@Body() createSalaryDto: CreateSalaryHistoryDto) {
    return this.salaryService.create(createSalaryDto);
  }

  @Get()
  findAll() {
    return this.salaryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salaryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSalaryDto: UpdateSalaryHistoryDto) {
    return this.salaryService.update(+id, updateSalaryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salaryService.remove(+id);
  }
}
