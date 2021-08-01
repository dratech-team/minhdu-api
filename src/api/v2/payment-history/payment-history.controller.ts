import {Body, Controller, Delete, Get, Param, Patch, Query} from '@nestjs/common';
import {PaymentHistoryService} from './payment-history.service';
import {UpdatePaymentHistoryDto} from './dto/update-payment-history.dto';

@Controller('v2/payment-history')
export class PaymentHistoryController {
  constructor(private readonly paymentHistoryService: PaymentHistoryService) {
  }

  @Get()
  findAll(
    @Query('customerId') customerId: number,
    @Query("skip") skip: number,
    @Query("take") take: number
  ) {
    return this.paymentHistoryService.findAll(+customerId, +skip, +take);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentHistoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentHistoryDto: UpdatePaymentHistoryDto) {
    return this.paymentHistoryService.update(+id, updatePaymentHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentHistoryService.remove(+id);
  }
}
