import {DatetimeUnit, EmployeeType, SalaryType} from "@prisma/client";
import {IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString,} from "class-validator";
import {Type} from "class-transformer";

export class CreateOvertimeTemplateDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsOptional()
  @IsEnum(SalaryType)
  readonly type?: SalaryType;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  readonly price: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly rate: number;

  @IsOptional()
  @IsEnum(DatetimeUnit)
  readonly unit?: DatetimeUnit;

  @IsOptional()
  @IsString()
  readonly note?: DatetimeUnit;

  @IsOptional()
  @IsNumber()
  readonly branchId: number;

  @IsNotEmpty()
  @IsArray()
  readonly positionIds: number[];

  @IsNotEmpty()
  @IsEnum(EmployeeType)
  readonly employeeType: EmployeeType;
}
