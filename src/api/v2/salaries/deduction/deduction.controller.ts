import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DeductionService } from './deduction.service';
import { CreateDeductionDto } from './dto/create-deduction.dto';
import { UpdateDeductionDto } from './dto/update-deduction.dto';

@Controller('v2/salary/deduction')
export class DeductionController {
  constructor(private readonly deductionService: DeductionService) {}

  @Post()
  create(@Body() createDeductionDto: CreateDeductionDto) {
    return this.deductionService.create(createDeductionDto);
  }

  @Get()
  findAll() {
    return this.deductionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deductionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDeductionDto: UpdateDeductionDto) {
    return this.deductionService.update(+id, updateDeductionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deductionService.remove(+id);
  }
}
