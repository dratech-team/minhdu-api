import {IsArray, IsNotEmpty} from "class-validator";

export class ItemExportDto {
  @IsArray()
  @IsNotEmpty()
  items: {
    key: string;
    value: string;
  }[]
}
