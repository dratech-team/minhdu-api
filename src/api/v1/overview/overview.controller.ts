import {Controller, Get, Query} from '@nestjs/common';
import {OverviewService} from './overview.service';
import {SearchHrOverviewDto} from "./dto/search-hr-overview.dto";
import {SearchSellOverviewDto} from "./dto/search-sell-overview.dto";
import {ApiConstant} from "../../../common/constant";

@Controller(ApiConstant.V1.OVERVIEW)
export class OverviewController {
  constructor(private readonly overviewService: OverviewService) {
  }

  @Get("hr")
  hr(@Query() search: SearchHrOverviewDto) {
    return this.overviewService.hr(search);
  }

  @Get("sell")
  sell(@Query() search: SearchSellOverviewDto) {
    return this.overviewService.sell(search);
  }
}
