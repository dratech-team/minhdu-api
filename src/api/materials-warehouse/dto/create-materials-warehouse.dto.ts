import { IsString, Length, IsEmail, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateMaterialsWarehouseDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "Ten kho" })
  readonly name: string;
}
