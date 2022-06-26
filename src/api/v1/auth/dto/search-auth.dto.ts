import {IsArray, IsNumber, IsOptional} from "class-validator";
import {Type} from "class-transformer";

export class SearchAuthDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly take: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly skip: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, {each: true})
  branchIds: number[];
}
