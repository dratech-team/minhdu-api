import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {AbsentService} from './absent.service';
import {CreateAbsentDto} from './dto/create-absent.dto';
import {UpdateAbsentDto} from './dto/update-absent.dto';
import {DeleteMultipleAbsentDto} from "./dto/delete-multiple-absent.dto";

@Controller('v2/salary/deduction')
export class AbsentController {
  constructor(private readonly absentService: AbsentService) {
  }

  @Post("/multiple/create")
  createMany(@Body() body: CreateAbsentDto) {
    return this.absentService.createMany(body);
  }

  @Get()
  findAll() {
    return this.absentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.absentService.findOne(+id);
  }

  @Post("/multiple/updation")
  updateMany(@Body() updateAbsentDto: UpdateAbsentDto) {
    return this.absentService.updateMany(updateAbsentDto);
  }

  @Post('multiple/deletion')
  removeMany(@Body() body: DeleteMultipleAbsentDto) {
    return this.absentService.removeMany(body);
  }
}
