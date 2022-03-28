import {IsNotEmpty, IsString} from "class-validator";

export class BaseSearchExportDto {
  @IsNotEmpty()
  @IsString()
  readonly filename: string;
}
