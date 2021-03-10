import { IsString, Length, IsEmail, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateVendorDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "Ma nha cung cap" })
  code: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "Ten nha cung cap" })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "Dia chi" })
  address: string;

  @IsString()
  @ApiProperty({ description: "Ghi chu" })
  note: string;
}
