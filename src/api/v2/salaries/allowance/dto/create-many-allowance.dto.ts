import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";
import {CreateAllowanceDto} from "./create-allowance.dto";
import {OmitType} from "@nestjs/mapped-types";

export class CreateManyAllowanceDto extends OmitType(CreateAllowanceDto, ["payrollId"]) {
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

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly payrollIds: number[];
}
