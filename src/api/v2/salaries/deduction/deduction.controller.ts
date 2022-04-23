import {Body, Controller, Delete, Get, Param, Post} from '@nestjs/common';
import {DeductionService} from './deduction.service';
import {CreateDeductionDto} from './dto/create-deduction.dto';
import {UpdateDeductionDto} from './dto/update-deduction.dto';
import {DeleteMultipleDeductionDto} from "./dto/delete-multiple-deduction.dto";
import {CreateAbsentDto} from "../absent/dto/create-absent.dto";

@Controller('v2/salary/deduction')
export class DeductionController {
  constructor(private readonly deductionService: DeductionService) {
  }

  @Post('/multiple/creation')
  create(@Body() createDeductionDto: CreateDeductionDto | CreateAbsentDto) {
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

  @Post('/multiple/updation')
  update(@Body() body: UpdateDeductionDto) {
    return this.deductionService.updateMany(body);
  }

  @Post('/multiple/deletion')
  remove(@Body() body: DeleteMultipleDeductionDto) {
    return this.deductionService.removeMany(body);
  }
}
