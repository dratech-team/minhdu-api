import {IsDate, IsEnum, IsNotEmpty, IsOptional, IsString} from "class-validator";
import {OptionFilterEnum, FilterSellEntity} from "../entities/filter-sell.entity";
import {Type} from "class-transformer";

export class SearchSellOverviewDto {
  @IsString()
  @IsEnum(FilterSellEntity)
  readonly filter: FilterSellEntity;

  @IsOptional()
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
