import {Transform, Type} from "class-transformer";
import {IsDate, IsOptional} from "class-validator";

export class ConfirmPayrollDto {
  @IsOptional()
  @Transform((val) => new Date(val.value))
  @Type(() => Date)
  @IsDate()
  readonly datetime: Date;
}
