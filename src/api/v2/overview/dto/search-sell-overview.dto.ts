import {IsDate, IsEnum, IsNotEmpty, IsOptional, IsString} from "class-validator";
import {OptionFilterEnum, TypeSellEntity} from "../entities/type-sell.entity";
import {Type} from "class-transformer";

export class SearchSellOverviewDto {
  @IsString()
  @IsEnum(TypeSellEntity)
  readonly filter: TypeSellEntity;

  @IsString()
  @IsEnum(OptionFilterEnum)
  readonly option: OptionFilterEnum;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly startedAt: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly endedAt: Date;


}
