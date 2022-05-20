import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EggTypeService } from './egg-type.service';
import { CreateEggTypeDto } from './dto/create-egg-type.dto';
import { UpdateEggTypeDto } from './dto/update-egg-type.dto';
import {ApiConstant} from "../../../common/constant";

@Controller(ApiConstant.V1.EGG_TYPE)
export class EggTypeController {
  constructor(private readonly eggTypeService: EggTypeService) {}

  @Post()
  create(@Body() createEggTypeDto: CreateEggTypeDto) {
    return this.eggTypeService.create(createEggTypeDto);
  }

  @Get()
  findAll() {
    return this.eggTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eggTypeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEggTypeDto: UpdateEggTypeDto) {
    return this.eggTypeService.update(+id, updateEggTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eggTypeService.remove(+id);
  }
}
