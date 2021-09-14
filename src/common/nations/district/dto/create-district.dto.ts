import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";

export class CreateDistrictDto {
  @IsNotEmpty()
  @IsString()
  readonly code: number;

  @IsNotEmpty()
  @IsString()
  readonly codename: string;

  @IsNotEmpty()
  @IsString()
  readonly divisionType: string;

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  readonly provinceId: number;
}
