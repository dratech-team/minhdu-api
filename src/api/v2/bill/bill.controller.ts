import {Controller, Get, Param} from '@nestjs/common';
import {BillService} from './bill.service';

@Controller('v2/bill')
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
