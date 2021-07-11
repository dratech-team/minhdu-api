import {IsBoolean, IsDate, IsOptional} from "class-validator";
import {Type} from "class-transformer";

export class UpdatePayrollDto {
  @IsOptional()
  @Type(() => Number)
  readonly salaryId?: number

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  accConfirmedAt?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  manConfirmedAt?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  paidAt?: Date;
}
