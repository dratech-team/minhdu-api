import { PartialType } from "@nestjs/mapped-types";
import { CustomerResource, CustomerType } from "@prisma/client";
import { Type } from "class-transformer";
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { CreateProfileDto } from "../../../../common/dtos/create-profile.dto";

export class CreateCustomerDto extends PartialType(CreateProfileDto) {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly provinceId: number;

  @IsOptional()
  @Type(() => Number)
  readonly districtId: number;

  @IsOptional()
  // @IsEnum(CustomerType)
  readonly customerType: CustomerType;

  @IsOptional()
  // @IsEnum(CustomerResource)
  readonly resource: CustomerResource;

  @IsOptional()
  @IsBoolean()
  readonly isPotential: boolean;

  @IsOptional()
  @IsString()
  readonly note: string;
}
