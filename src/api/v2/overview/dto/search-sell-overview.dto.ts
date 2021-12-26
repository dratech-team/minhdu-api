import {IsEnum, IsString} from "class-validator";
import {TypeSellEntity} from "../entities/type-sell.entity";

export class SearchSellOverviewDto {
  @IsString()
  @IsEnum(TypeSellEntity)
  readonly filter: TypeSellEntity;
}
