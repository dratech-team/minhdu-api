import { PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { ActionProduct } from "../entities/action-product.enum";
import { CreateProductDto } from "./create-product.dto";

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsEnum(ActionProduct)
  @IsNotEmpty()
  readonly action: ActionProduct;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly desWarehouseId?: number;
}
