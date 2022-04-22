import {Body, Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common';
import {Salaryv2Service} from './salaryv2.service';
import {CreateSalaryv2Dto} from './dto/create-salaryv2.dto';
import {UpdateSalaryv2Dto} from './dto/update-salaryv2.dto';

@Controller('v2/salaryv2')
export class Salaryv2Controller {
  constructor(private readonly salaryv2Service: Salaryv2Service) {
  }

  @Post("/multiple/create")
  createMany(@Body() body: CreateSalaryv2Dto) {
    return this.salaryv2Service.createMany(body);
  }

  @Get()
  findAll() {
    return this.salaryv2Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salaryv2Service.findOne(+id);
  }

  @Post('/multiple/update')
  updateMany(@Body() updateSalaryv2Dto: UpdateSalaryv2Dto) {
    return this.salaryv2Service.updateMany(updateSalaryv2Dto);
  }

  @Delete('multiple')
  removeMany(@Body('salaryIds') salaryIds: number[]) {
    return this.salaryv2Service.removeMany(salaryIds);
  }
}
