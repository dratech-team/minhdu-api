import {Transform, Type} from "class-transformer";
import {IsDate, IsOptional} from "class-validator";

export class ConfirmPayrollDto {
  @IsOptional()
  @Transform((val) => new Date(val.value))
  @Type(() => Date)
  @IsDate()
  readonly accConfirmedAt: Date;

  @IsOptional()
  @Transform((val) => new Date(val.value))
  @Type(() => Date)
  @IsDate()
  readonly manConfirmedAt: Date;

  @IsOptional()
  @Transform((val) => new Date(val.value))
  @Type(() => Date)
  @IsDate()
  readonly paidAt: Date;
}
