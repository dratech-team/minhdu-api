import {FilterTypeEnum} from "../entities/filter-type.enum";
import {IsDate, IsEnum, IsNotEmpty, IsOptional, IsString} from "class-validator";
import {Transform, Type} from "class-transformer";

export class SearchExportDto {
  @IsNotEmpty()
  @IsString()
  readonly filename: string;

  @IsOptional()
  @Type(() => Date)
  @Transform(val => new Date(val.value))
  @IsDate()
  readonly createdAt: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @Transform(val => new Date(val.value))
  @IsDate()
  readonly startedAt: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @Transform(val => new Date(val.value))
  @IsDate()
  readonly endedAt: Date;

  @IsNotEmpty()
  @IsEnum(FilterTypeEnum)
  readonly exportType: FilterTypeEnum;
}
