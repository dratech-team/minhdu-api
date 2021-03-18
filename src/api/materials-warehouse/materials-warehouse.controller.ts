/* eslint-disable no-useless-constructor */
import {
  Controller,
  Get,
  Post,
  Body,
  Response,
  Param,
  Delete,
  Query,
  Request,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { MaterialsWarehouseService } from "./materials-warehouse.service";
import { CreateMaterialsWarehouseDto } from "./dto/create-materials-warehouse.dto";
import { UpdateMaterialsWarehouseDto } from "./dto/update-materials-warehouse.dto";
import { typesHelpers } from "../../core/common/types-helpers.common";

@ApiTags("Materials Warehouse")
@Controller("materials-warehouse")
export class MaterialsWarehouseController {
  constructor(
    private readonly materialsWarehouseService: MaterialsWarehouseService
  ) {}

  @Post()
  async create(
    @Body() createMaterialsWarehouseDto: CreateMaterialsWarehouseDto
  ) {
    return this.materialsWarehouseService.create(createMaterialsWarehouseDto);
  }

  @Get()
  async findAll(@Response() res, @Query() query) {
    // const {
    //   materialsWarehouse = [],
    //   total = 0,
    // } = await this.materialsWarehouseService.findAll(query);
    // return res.status(200).sendItems(materialsWarehouse, total);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.materialsWarehouseService.findOne(id);
  }

  @Delete(":id")
  async remove(@Param("id") id: string, @Response() res) {
    await this.materialsWarehouseService.remove(id);
    return res.status(204).send();
  }
}
