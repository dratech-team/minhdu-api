import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AllowanceService } from './allowance.service';
import { CreateAllowanceDto } from './dto/create-allowance.dto';
import { UpdateAllowanceDto } from './dto/update-allowance.dto';
import {DeleteMultipleAllowanceDto} from "./dto/delete-multiple-allowance.dto";

@Controller('v2/salary/allowance')
export class AllowanceController {
  constructor(private readonly allowanceService: AllowanceService) {}

  @Post("multiple/creation")
  createMany(@Body() body: CreateAllowanceDto) {
    return this.allowanceService.createMany(body);
  }

  @Get()
  findAll() {
    return this.allowanceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.allowanceService.findOne(+id);
  }

  @Post("multiple/updation")
  updateMany(@Body() body: UpdateAllowanceDto) {
    return this.allowanceService.updateMany(body);
  }

  @Post("multiple/deletion")
  removeMany(@Body() body: DeleteMultipleAllowanceDto) {
    return this.allowanceService.removeMany(body);
  }
}
