import {CustomerResource, CustomerType} from "@prisma/client";
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
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly phone: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly nationId: number;

  @IsOptional()
  readonly customerType: CustomerType;

  @IsOptional()
  readonly resource: CustomerResource;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  readonly isPotential: boolean;
}
