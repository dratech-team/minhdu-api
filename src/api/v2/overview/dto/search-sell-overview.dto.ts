import {IsEnum, IsString} from "class-validator";
import {OptionFilterEnum, TypeSellEntity} from "../entities/type-sell.entity";

export class SearchSellOverviewDto {
  @IsString()
  @IsEnum(TypeSellEntity)
  readonly filter: TypeSellEntity;

  @IsString()
  @IsEnum(OptionFilterEnum)
  readonly option: OptionFilterEnum;


}
