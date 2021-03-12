import {
  IsString,
  IsMongoId,
  IsNotEmpty,
  IsDateString,
  IsNumber,
  Min
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateStorageDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "Ma hang" })
  code: string;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({ description: "Id Nha cung cap" })
  vendorId: string;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({ description: "Id Kho" })
  materialWarehouseId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "Ten mat hang" })
  name: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ description: "Ngay het han" })
  dateExpired: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @ApiProperty({ description: "So luong" })
  quantity: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @ApiProperty({ description: "Don gia" })
  price: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @ApiProperty({ description: "Don gia" })
  discount: number;
}
