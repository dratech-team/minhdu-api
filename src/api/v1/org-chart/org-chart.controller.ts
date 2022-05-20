import {Controller, Get, Param} from '@nestjs/common';
import {OrgChartService} from './org-chart.service';

@Controller('v2/org-chart')
export class OrgChartController {
  constructor(private readonly diagramService: OrgChartService) {
  }

  @Get()
  findAll() {
    return this.diagramService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.diagramService.findOne();
  }
}
