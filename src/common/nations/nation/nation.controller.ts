import {Body, Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common';
import {NationService} from './nation.service';
import {CreateNationDto} from './dto/create-nation.dto';
import {UpdateNationDto} from './dto/update-nation.dto';
import {ApiConstant} from "../../constant";

@Controller(ApiConstant.V1.ORGCHART.NATION)
export class NationController {
  constructor(private readonly nationService: NationService) {
  }

  @Post()
  create(@Body() createNationDto: CreateNationDto) {
    return this.nationService.create(createNationDto);
  }

  @Get()
  findAll() {
    return this.nationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNationDto: UpdateNationDto) {
    return this.nationService.update(+id, updateNationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nationService.remove(+id);
  }
}
