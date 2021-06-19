import {IsBoolean, IsDate, IsOptional} from "class-validator";
import {Type} from "class-transformer";

export class UpdatePayrollDto {
  @IsOptional()
  @Type(() => Number)
  readonly salaryId: number

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  readonly accConfirmedAt: Date

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  readonly manConfirmedAt: Date;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  readonly isPaid: boolean;
}
