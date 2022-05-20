import {Controller, Get, Post, Body, Patch, Param, Delete, Query} from '@nestjs/common';
import {FinanceService} from './finance.service';
import {CreateFinanceDto} from './dto/create-finance.dto';
import {UpdateFinanceDto} from './dto/update-finance.dto';

@Controller('v2/finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {
  }

  @Post()
  create(@Body() createFinanceDto: CreateFinanceDto) {
    return this.financeService.create(createFinanceDto);
  }

  @Get()
  findAll(
    @Query("year") year: Date
  ) {
    return this.financeService.findAll(new Date(year));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.financeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFinanceDto: UpdateFinanceDto) {
    return this.financeService.update(+id, updateFinanceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.financeService.remove(+id);
  }
}
