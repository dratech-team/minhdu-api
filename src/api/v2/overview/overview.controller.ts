import {Controller, Get, Query} from '@nestjs/common';
import {OverviewService} from './overview.service';
import {SearchHrOverviewDto} from "./dto/search-hr-overview.dto";

@Controller('v2/overview')
export class OverviewController {
  constructor(private readonly overviewService: OverviewService) {
  }

  @Get("hr")
  findAll(@Query() search: SearchHrOverviewDto) {
    return this.overviewService.findAll(search);
  }
}
