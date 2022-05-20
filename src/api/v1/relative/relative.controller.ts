import {Body, Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common';
import {RelativeService} from './relative.service';
import {CreateRelativeDto} from './dto/create-relative.dto';
import {UpdateRelativeDto} from './dto/update-relative.dto';
import {ApiConstant} from "../../../common/constant";

@Controller(ApiConstant.V1.RELATIVE)
export class RelativeController {
  constructor(private readonly relativeService: RelativeService) {
  }

  @Post()
  create(@Body() createRelativeDto: CreateRelativeDto) {
    return this.relativeService.create(createRelativeDto);
  }

  @Get()
  findAll() {
    return this.relativeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.relativeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRelativeDto: UpdateRelativeDto) {
    return this.relativeService.update(+id, updateRelativeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.relativeService.remove(+id);
  }
}
