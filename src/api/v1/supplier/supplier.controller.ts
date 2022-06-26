import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';
import {ApiConstant} from "../../../common/constant";
import {SupplierService} from "./supplier.service";
import {CreateSupplierDto} from "./dto/create-supplier.dto";
import {SearchSupplierDto} from "./dto/search-supplier.dto";
import {UpdateSupplierDto} from "./dto/update-supplier.dto";

@Controller(ApiConstant.V1.WAREHOUSE.SUPPLIER)
export class SupplierController {
  constructor(private readonly providerService: SupplierService) {
  }

  @Post()
  create(@Body() createProviderDto: CreateSupplierDto) {
    return this.providerService.create(createProviderDto);
  }

  @Get()
  findAll(@Query() search: SearchSupplierDto) {
    return this.providerService.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.providerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProviderDto: UpdateSupplierDto) {
    return this.providerService.update(+id, updateProviderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.providerService.remove(+id);
  }
}
