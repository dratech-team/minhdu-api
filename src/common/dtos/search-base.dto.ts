import {IsNotEmpty, IsNumber} from "class-validator";
import {Type} from "class-transformer";

export class SearchBaseDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly take: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly skip: number;
}
