import {DatetimeUnit} from "@prisma/client";
import {IsArray, IsEnum, IsNumber, IsOptional, IsString} from "class-validator";
import {Transform, Type} from "class-transformer";

export class SearchOvertimeTemplateDto {
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
  readonly title: string;

  @IsOptional()
  @IsArray()
  @Transform(val => {
    return typeof val?.value === 'string' ? Array.of(+val.value) : val.value.map(e => +e);
  })
  readonly branchIds: number[];

  @IsOptional()
  readonly positionIds: number[];

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly price: number;

  @IsOptional()
  @IsEnum(DatetimeUnit)
  readonly unit: DatetimeUnit;
}
