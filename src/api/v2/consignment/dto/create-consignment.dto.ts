import {IsDate, IsNotEmpty, IsNumber, IsString} from "class-validator";
import {Type} from "class-transformer";

export class CreateConsignmentDto {
  @IsNotEmpty()
  @IsString()
  readonly code: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  readonly mfg: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  readonly exp: Date;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly amount: string;
}
