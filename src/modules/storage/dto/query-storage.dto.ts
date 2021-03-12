import {
  IsString,
  IsMongoId,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsNumber,
  Min
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class QueryStorageDto {
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({ description: "Id Kho" })
  materialWarehouseId: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: "Ma hang/Ten mat hang" })
  textSearch: string;

  @IsMongoId()
  @IsOptional()
  @ApiProperty({ description: "Id Nha cung cap" })
  vendorId: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ description: "Date Expired From" })
  dateExpiredFrom: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ description: "Date Expired To" })
  dateExpiredTo: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ description: "Date Import From" })
  dateImportFrom: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ description: "Date Import From" })
  dateImportTo: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: "Skip Number" })
  skip: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: "Limit Number" })
  limit: number;

  // @IsString()
  // @IsOptional()
  // @ApiProperty({ description: "Sort" })
  // sort: string;
}
