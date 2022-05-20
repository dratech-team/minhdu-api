import {IsNotEmpty, IsString} from "class-validator";

export class CreateCommodityTemplateDto {
  @IsNotEmpty()
  @IsString()
  readonly code: string;

  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
