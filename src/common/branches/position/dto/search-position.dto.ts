import {IsNumber, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";

export class SearchPositionDto {
  @IsOptional()
  @IsString()
  readonly position: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly workday: number;
}
