import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AllowanceService } from './allowance.service';
import { CreateAllowanceDto } from './dto/create-allowance.dto';
import { UpdateAllowanceDto } from './dto/update-allowance.dto';

@Controller('v2/salary/allowance')
export class AllowanceController {
  constructor(private readonly allowanceService: AllowanceService) {}

  @Post()
  create(@Body() createAllowanceDto: CreateAllowanceDto) {
    return this.allowanceService.create(createAllowanceDto);
  }

  @Get()
  findAll() {
    return this.allowanceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.allowanceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAllowanceDto: UpdateAllowanceDto) {
    return this.allowanceService.update(+id, updateAllowanceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.allowanceService.remove(+id);
  }
}
