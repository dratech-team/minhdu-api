import {IsEnum, IsNumber, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";
import {SortRouteEnum} from "../enums/sort-route.enum";
import {SearchRangeDto} from "../../../../common/dtos/search-range.dto";

export class SearchRouteDto extends SearchRangeDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly skip: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly take: number;

  @IsOptional()
  @IsString()
  readonly search: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly status: 0 | 1 | -1;


  @IsOptional()
  @IsEnum(SortRouteEnum)
  readonly sort: SortRouteEnum;

  @IsOptional()
  @IsString()
  readonly sortType: "asc" | "desc";
}
