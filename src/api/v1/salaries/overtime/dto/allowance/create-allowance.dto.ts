import {IsNotEmpty, IsNumber, IsString} from "class-validator";
import {Type} from "class-transformer";

export class CreateOvertimeAllowanceDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly price: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly overtimeId: number;
}
