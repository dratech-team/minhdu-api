import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";

export class CreateWardDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly code: string;

  @IsNotEmpty()
  @IsString()
  readonly codename: string;

  @IsNotEmpty()
  @IsString()
  readonly shortCodename: string;

  @IsNotEmpty()
  @IsString()
  readonly divisionType: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  readonly districtId: number;
}
