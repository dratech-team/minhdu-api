import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaymentHistoryService } from './payment-history.service';
import { CreatePaymentHistoryDto } from './dto/create-payment-history.dto';
import { UpdatePaymentHistoryDto } from './dto/update-payment-history.dto';

@Controller('v2/payment-history')
export class PaymentHistoryController {
  constructor(private readonly paymentHistoryService: PaymentHistoryService) {}

  // @Post()
  // create(@Body() createPaymentHistoryDto: CreatePaymentHistoryDto) {
  //   return this.paymentHistoryService.create(createPaymentHistoryDto);
  // }

  // @Get()
  // findAll() {
  //   return this.paymentHistoryService.findAll();
  // }

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
