import {IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested} from "class-validator";
import {Type} from "class-transformer";
import { CreateDistrictDto } from "../../district/dto/create-district.dto";

export class CreateProvinceDto {
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
  readonly phoneCode: number;

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  readonly nationId: number;

  @ValidateNested()
  readonly districts?: CreateDistrictDto[];
}
