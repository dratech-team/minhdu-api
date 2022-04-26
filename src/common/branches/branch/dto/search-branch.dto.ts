import {IsNumber, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";

export class SearchBranchDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly take: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly skip: number;

  @IsOptional()
  @IsString()
  readonly search: string;
}
