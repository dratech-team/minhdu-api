import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";

export class CreateAllowanceDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly price: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly rate: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly branchId: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly payrollId: number;
}
