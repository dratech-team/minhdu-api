import {Body, Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common';
import {ConsignmentService} from './consignment.service';
import {CreateConsignmentDto} from './dto/create-consignment.dto';
import {UpdateConsignmentDto} from './dto/update-consignment.dto';
import {ApiConstant} from "../../../common/constant";

@Controller(ApiConstant.V1.WAREHOUSE.CONSIGNMENT)
export class ConsignmentController {
  constructor(private readonly consignmentService: ConsignmentService) {
  }

  @Post()
  create(@Body() createConsignmentDto: CreateConsignmentDto) {
    return this.consignmentService.create(createConsignmentDto);
  }

  @Get()
  findAll() {
    return this.consignmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.consignmentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConsignmentDto: UpdateConsignmentDto) {
    return this.consignmentService.update(+id, updateConsignmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.consignmentService.remove(+id);
  }
}
