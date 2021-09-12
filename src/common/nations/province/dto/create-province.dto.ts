import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";

export class CreateProvinceDto {
  @IsNotEmpty()
  @IsString()
  readonly code: string;

  @IsNotEmpty()
  @IsString()
  readonly codename: string;

  @IsNotEmpty()
  @IsString()
  readonly divisionType: string;

  @IsNotEmpty()
  @IsString()
  readonly phoneCode: string;

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  readonly nationId: number;
}
