import {Body, Controller, Delete, Get, Param, Patch, Post, Query, Res, UseGuards} from '@nestjs/common';
import {CustomerService} from './customer.service';
import {CreateCustomerDto} from './dto/create-customer.dto';
import {UpdateCustomerDto} from './dto/update-customer.dto';
import {ApiV2Constant} from "../../../common/constant/api.constant";
import {CustomerResource, CustomerType, RoleEnum} from '@prisma/client';
import {CreatePaymentHistoryDto} from "../payment-history/dto/create-payment-history.dto";
import {JwtAuthGuard} from "../../../core/guard/jwt-auth.guard";
import {ApiKeyGuard} from "../../../core/guard/api-key-auth.guard";
import {RolesGuard} from "../../../core/guard/role.guard";
import {LoggerGuard} from "../../../core/guard/logger.guard";
import {Roles} from 'src/core/decorators/roles.decorator';
import {SearchCustomerDto} from "./dto/search-customer.dto";

@UseGuards(JwtAuthGuard, ApiKeyGuard)
@Controller(ApiV2Constant.CUSTOMER)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {
  }

  @UseGuards(RolesGuard, LoggerGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.SALESMAN)
  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(createCustomerDto);
  }

  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.SALESMAN)
  @Get()
  findAll(@Query() search: SearchCustomerDto) {
    return this.customerService.findAll(search);
  }

  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.SALESMAN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerService.findOne(+id);
  }

  @UseGuards(RolesGuard, LoggerGuard)
  @Roles(RoleEnum.SALESMAN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customerService.update(+id, updateCustomerDto);
  }

  @UseGuards(RolesGuard, LoggerGuard)
  @Roles(RoleEnum.SALESMAN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerService.remove(+id);
  }

  // @Get("/export/print")
  // export(
  //   @Res() res,
  //   @Query("name") name: string,
  //   @Query("phone") phone: string,
  //   @Query("nationId") nationId: number,
  //   @Query("customerType") type: CustomerType,
  //   @Query("resource") resource: CustomerResource,
  //   @Query("isPotential") isPotential: number,
  // ) {
  //   return this.customerService.export(
  //     res,
  //     {
  //       name,
  //       phone,
  //       nationId: +nationId,
  //       type,
  //       resource,
  //       isPotential: +isPotential
  //     },
  //   );
  // }

  // @UseGuards(RolesGuard, LoggerGuard)
  @Roles(RoleEnum.ADMIN)
  @Patch(':id/payment')
  payment(@Param('id') id: number, @Body() body: CreatePaymentHistoryDto) {
    return this.customerService.payment(+id, body);
  }
}
