import {CustomerResource, CustomerType, GenderType} from "@prisma/client";
import {IsBoolean, IsEnum, IsNumber, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";

export class SearchCustomerDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly take: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly skip: number;

  @IsOptional()
  @IsString()
  readonly search: string;

  @IsOptional()
  readonly type: CustomerType;

  @IsOptional()
  readonly resource: CustomerResource;

  @IsOptional()
  @Type(() => Number)
  readonly isPotential: Number;

  @IsOptional()
  readonly gender: GenderType;
}
