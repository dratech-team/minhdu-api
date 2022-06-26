import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';
import {EggService} from './egg.service';
import {CreateEggDto} from './dto/create-egg.dto';
import {UpdateEggDto} from './dto/update-egg.dto';
import {SearchEggDto} from "./dto/search-egg.dto";
import {ApiConstant} from "../../../common/constant";

@Controller(ApiConstant.V1.EGG)
export class EggController {
  constructor(private readonly eggService: EggService) {
  }

  @Post()
  create(@Body() createEggDto: CreateEggDto) {
    return this.eggService.create(createEggDto);
  }

  @Get()
  findAll(@Query() search: SearchEggDto) {
    return this.eggService.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eggService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEggDto: UpdateEggDto) {
    return this.eggService.update(+id, updateEggDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eggService.remove(+id);
  }
}
