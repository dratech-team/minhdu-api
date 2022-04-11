import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";

export class SearchHolidayDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly take: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly skip: number;

  @IsOptional()
  @IsString()
  readonly name: string;

  readonly datetime: Date;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly rate: number;

  @IsOptional()
  @IsString()
  readonly branch: string;

  @IsOptional()
  @IsString()
  readonly position: string;
}
