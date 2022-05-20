import {IsEnum, IsString} from "class-validator";
import {FilterTypeEntity} from "../entities/filter-type.entity";

export class SearchHrOverviewDto {
  @IsString()
  @IsEnum(FilterTypeEntity)
  readonly filter: FilterTypeEntity;
}
