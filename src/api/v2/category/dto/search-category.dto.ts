import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";

export class SearchCategoryDto {
  @IsOptional()
  // @IsNumber()
  @Type(() => Number)
  readonly branchId: number;

  @IsOptional()
  @IsString()
  readonly branch: string;
}
