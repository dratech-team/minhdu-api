import {IsNotEmpty, IsNumber, IsOptional} from "class-validator";
import {Type} from "class-transformer";

export class SearchAdminDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly year: number;
}
