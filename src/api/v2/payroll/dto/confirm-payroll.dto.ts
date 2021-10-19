import {Transform, Type} from "class-transformer";
import {IsDate, IsOptional} from "class-validator";

export class ConfirmPayrollDto {
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  readonly datetime: Date;
}
