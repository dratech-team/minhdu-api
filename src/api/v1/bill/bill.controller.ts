import {Controller, Get, Param} from '@nestjs/common';
import {BillService} from './bill.service';
import {ApiConstant} from "../../../common/constant";

@Controller(ApiConstant.V1.BILL)
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
