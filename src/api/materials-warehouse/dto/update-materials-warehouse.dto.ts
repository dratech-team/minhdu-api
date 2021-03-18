import { PartialType } from "@nestjs/mapped-types";
import { CreateMaterialsWarehouseDto } from "./create-materials-warehouse.dto";

export class UpdateMaterialsWarehouseDto extends PartialType(
  CreateMaterialsWarehouseDto
) {}
