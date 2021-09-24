import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateBasicTemplateDto {
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  readonly price: number;
}
