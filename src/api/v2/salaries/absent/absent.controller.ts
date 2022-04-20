import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AbsentService } from './absent.service';
import { CreateAbsentDto } from './dto/create-absent.dto';
import { UpdateAbsentDto } from './dto/update-absent.dto';

@Controller('v2/salary/absent')
export class AbsentController {
  constructor(private readonly absentService: AbsentService) {}

  @Post()
  createMany(@Body() createAbsentDto: CreateAbsentDto) {
    return this.absentService.createMany(createAbsentDto);
  }

  @Get()
  findAll() {
    return this.absentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.absentService.findOne(+id);
  }

  @Post('multiple')
  updateMany(@Body() updateAbsentDto: UpdateAbsentDto) {
    return this.absentService.updateMany(updateAbsentDto);
  }

  @Delete('multiple')
  removeMany(@Body('salaryIds') salaryIds: number[]) {
    return this.absentService.removeMany(salaryIds);
  }
}
