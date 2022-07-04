import {IsArray, IsNotEmpty} from "class-validator";

export class ItemExportDto {
  @IsNotEmpty()
  @IsArray()
  items: {
    key: string;
    value: string;
  }[];
}
