import {IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";
import {MedicineUnit} from "@prisma/client";

export class CreateMedicineDto {
  @IsOptional()
  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  readonly barcode: string;

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly provider: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  readonly expire: Date;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  readonly price: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  readonly discount: number;

  @IsOptional()
  @IsString()
  readonly invoice: string;

  @IsNotEmpty()
  @IsEnum(MedicineUnit)
  readonly unit: MedicineUnit;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  readonly amount: number;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  readonly createdAt: Date;
}
