import {IsNumber, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";

export class SearchRouteDto {
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
  readonly name: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Date)
  readonly startedAt: Date;

  @IsOptional()
  @IsNumber()
  @Type(() => Date)
  readonly endedAt: Date;

  @IsOptional()
  @IsString()
  readonly driver: string;

  @IsOptional()
  @IsString()
  readonly bsx: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly status: 0 | 1
}
