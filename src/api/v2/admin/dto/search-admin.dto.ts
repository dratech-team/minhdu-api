import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";

export class SearchAdminDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly year: number;

  @IsOptional()
  @IsString()
  readonly branch: string;
}
