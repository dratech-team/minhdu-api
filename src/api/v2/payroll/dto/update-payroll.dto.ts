import {IsBoolean, IsDate, IsNumber, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";
import {CreatePayrollDto} from "./create-payroll.dto";
import {PartialType} from "@nestjs/mapped-types";

export class UpdatePayrollDto extends PartialType(CreatePayrollDto) {
  @IsOptional()
  @Type(() => Number)
  readonly salaryId?: number

  /// TODO: Tạo endpoint mới cho việc này
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  readonly accConfirmedAt?: Date;

  /// TODO: Tạo endpoint mới cho việc này
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  readonly manConfirmedAt?: Date;

  @IsOptional()
  @Type(() => Number)
  readonly branchId?: number;

  @IsOptional()
  @Type(() => Number)
  readonly positionId?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  readonly paidAt?: Date;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  readonly taxed?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly total?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly actualday?: number;

  @IsOptional()
  @IsString()
  readonly note?: string;
}
