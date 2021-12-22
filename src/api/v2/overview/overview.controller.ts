import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';
import {OverviewService} from './overview.service';
import {CreateOverviewDto} from './dto/create-overview.dto';
import {UpdateOverviewDto} from './dto/update-overview.dto';
import {SearchHROverviewDto} from "./dto/search-h-r-overview.dto";

@Controller('v2/overview')
export class OverviewController {
  constructor(private readonly hrOverviewService: OverviewService) {
  }

  @Post()
  create(@Body() createHrOverviewDto: CreateOverviewDto) {
    return this.hrOverviewService.create(createHrOverviewDto);
  }

  @Get("/hr")
  findAll(@Query() search: SearchHROverviewDto) {
    return this.hrOverviewService.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hrOverviewService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHrOverviewDto: UpdateOverviewDto) {
    return this.hrOverviewService.update(+id, updateHrOverviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hrOverviewService.remove(+id);
  }
}
