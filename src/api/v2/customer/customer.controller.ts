import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';
import {CustomerService} from './customer.service';
import {CreateCustomerDto} from './dto/create-customer.dto';
import {UpdateCustomerDto} from './dto/update-customer.dto';
import {ApiV2Constant} from "../../../common/constant/api.constant";
import {CustomerResource, CustomerType} from '@prisma/client';
import {CreatePaymentHistoryDto} from "../payment-history/dto/create-payment-history.dto";

@Controller(ApiV2Constant.CUSTOMER)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {
  }

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(createCustomerDto);
  }

  @Get()
  findAll(
    @Query("skip") skip: number,
    @Query("take") take: number,
    @Query("name") name: string,
    @Query("phone") phone: string,
    @Query("nationId") nationId: number,
    @Query("customerType") type: CustomerType,
    @Query("resource") resource: CustomerResource,
    @Query("isPotential") isPotential: number,
  ) {
    return this.customerService.findAll(+skip, +take, name, phone, +nationId, type, resource, +isPotential);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customerService.update(+id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerService.remove(+id);
  }

  @Patch(':id/payment')
  payment(@Param('id') id: number, @Body() body: CreatePaymentHistoryDto) {
    return this.customerService.payment(+id, body);
  }
}
