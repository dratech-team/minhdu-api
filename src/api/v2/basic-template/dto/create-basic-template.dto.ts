import {Type} from "class-transformer";
import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class CreateBasicTemplateDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  readonly price: number;
}
