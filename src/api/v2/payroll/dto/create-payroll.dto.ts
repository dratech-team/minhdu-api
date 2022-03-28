import {IsDate, IsNotEmpty, IsNumber, IsOptional,} from "class-validator";
import {Transform, Type} from "class-transformer";

export class CreatePayrollDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly employeeId?: number;

  @IsNotEmpty()
  @Type(() => Date)
  @Transform(val => new Date(val.value))
  @IsDate()
  readonly createdAt: Date;
}
