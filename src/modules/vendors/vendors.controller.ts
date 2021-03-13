import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Response,
  Param,
  Delete,
  Request
} from "@nestjs/common";
import { VendorsService } from "./vendors.service";
import { CreateVendorDto } from "./dto/create-vendor.dto";
import { ApiTags, ApiResponse } from "@nestjs/swagger";

@ApiTags("Vendors")
@Controller("vendors")
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Post()
  async create(@Body() createVendorDto: CreateVendorDto) {
    return this.vendorsService.create(createVendorDto);
  }

  @Get()
  async findAll(@Query() query, @Response() res) {
    const { vendors, total } = await this.vendorsService.findAll(query);
    return res.status(200).sendItems(vendors, total);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.vendorsService.findOne(id);
  }

  @Delete(":id")
  async remove(@Param("id") id: string, @Response() res) {
    await this.vendorsService.remove(id);
    return res.status(204).send();
  }
}
