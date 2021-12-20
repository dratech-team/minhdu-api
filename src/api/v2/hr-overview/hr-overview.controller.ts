import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';
import {HrOverviewService} from './hr-overview.service';
import {CreateHrOverviewDto} from './dto/create-hr-overview.dto';
import {UpdateHrOverviewDto} from './dto/update-hr-overview.dto';
import {HrOverviewFilterEnum} from "./entities/hr-overview-filter.enum";
import {SearchHrOverviewDto} from "./dto/search-hr-overview.dto";

@Controller('v2/hr-overview')
export class HrOverviewController {
  constructor(private readonly hrOverviewService: HrOverviewService) {
  }

  @Post()
  create(@Body() createHrOverviewDto: CreateHrOverviewDto) {
    return this.hrOverviewService.create(createHrOverviewDto);
  }

  @Get()
  findAll(@Query() search: SearchHrOverviewDto) {
    return this.hrOverviewService.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hrOverviewService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHrOverviewDto: UpdateHrOverviewDto) {
    return this.hrOverviewService.update(+id, updateHrOverviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hrOverviewService.remove(+id);
  }
}
