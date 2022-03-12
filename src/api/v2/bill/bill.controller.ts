import {Controller, Get, Param} from '@nestjs/common';
import {BillService} from './bill.service';
import {ApiV2Constant} from "../../../common/constant/api.constant";

@Controller(ApiV2Constant.BILL)
export class BillController {
  constructor(private readonly billService: BillService) {
  }

  @Get()
  findAll() {
    return this.billService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.billService.findOne(+id);
  }
}
