import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateWardDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsNumber()
  readonly code: number;

  @IsNotEmpty()
  @IsString()
  readonly codename: string;

  @IsNotEmpty()
  @IsString()
  readonly divisionType: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  readonly districtId: number;
}
