import {
  IsString,
  Length,
  IsEmail,
  IsNotEmpty,
  IsIn,
  IsInt,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class GetMaterialsWarehouseDto {
  @IsString()
  @ApiProperty({ description: "Ten kho" })
  readonly search: string;

  @IsIn(["ASC", "DESC"])
  readonly sort: string;

  @IsInt()
  readonly skip: number;

  @IsInt()
  readonly limit: number;
}
