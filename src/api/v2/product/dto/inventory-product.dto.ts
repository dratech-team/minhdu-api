import {PickType} from "@nestjs/mapped-types";
import {CreateProductDto} from "./create-product.dto";
import {IsArray, IsNotEmpty, IsNumber, ValidateNested} from "class-validator";
import {Type} from "class-transformer";

export class InventoryProductDto extends PickType(CreateProductDto, ["amount"]) {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly id: number;
}

export class InventoryProductsDto {
  @IsArray()
  @ValidateNested()
  readonly products: InventoryProductDto[];
}
