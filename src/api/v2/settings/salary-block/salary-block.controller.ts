import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SalaryBlockService } from './salary-block.service';
import { CreateSalaryBlockDto } from './dto/create-salary-block.dto';
import { UpdateSalaryBlockDto } from './dto/update-salary-block.dto';

@Controller('v2/settings/salary-block')
export class SalaryBlockController {
  constructor(private readonly salaryBlockService: SalaryBlockService) {}

  @Post()
  create(@Body() createSalaryBlockDto: CreateSalaryBlockDto) {
    return this.salaryBlockService.create(createSalaryBlockDto);
  }

  @Get()
  findAll() {
    return this.salaryBlockService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salaryBlockService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSalaryBlockDto: UpdateSalaryBlockDto) {
    return this.salaryBlockService.update(+id, updateSalaryBlockDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salaryBlockService.remove(+id);
  }
}
