import { IsNumber, IsString } from "class-validator";

export class ISalaryDto {
  @IsString()
  title: string;

  @IsNumber()
  amount: number;
}
