import {IsDate, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";

export class CreateMaterialDto {

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly provider: string;


  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  readonly price: number;


  @IsOptional()
  @IsString()
  readonly invoice: string;


  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  readonly amount: number;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  readonly createdAt: Date;
}
