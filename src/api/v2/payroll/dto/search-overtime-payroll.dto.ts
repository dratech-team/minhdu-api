import {IsDate, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";

export class SearchOvertimePayrollDto {
  @IsOptional()
  @IsString()
  readonly type: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  readonly startAt: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  readonly endAt: Date;

  @IsOptional()
  @IsString()
  readonly title: string;

  @IsOptional()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly searchType: string;

  @IsOptional()
  @IsString()
  readonly position: string;

  @IsOptional()
  @IsString()
  readonly branch: string;
}
