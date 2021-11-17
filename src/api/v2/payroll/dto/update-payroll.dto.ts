import {IsBoolean, IsDate, IsOptional} from "class-validator";
import {Transform, Type} from "class-transformer";

export class UpdatePayrollDto {
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
  @Type(() => Date)
  @IsDate()
  readonly paidAt?: Date;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  readonly taxed?: boolean;
}
