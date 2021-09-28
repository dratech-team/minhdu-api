import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateAllowanceDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  readonly price: number;
}
