import {PickType} from "@nestjs/mapped-types";
import {CreateProductDto} from "../../product/dto/create-product.dto";
import {IsArray, IsNotEmpty, IsNumber, ValidateNested} from "class-validator";
import {Type} from "class-transformer";

export class InventoryProductDto extends PickType(CreateProductDto, ["amount"]) {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly id: number;
}

export class CreateWarehouseHistoryDto {
  @IsArray()
  @ValidateNested()
  readonly products: InventoryProductDto[];
}
