import {IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";
import {ImportExportType} from "@prisma/client";

export class SearchImportExportDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly take: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly skip: number;

  @IsOptional()
  @IsEnum(ImportExportType)
  readonly type: ImportExportType;

  @IsOptional()
  @IsString()
  readonly product: string;
}
