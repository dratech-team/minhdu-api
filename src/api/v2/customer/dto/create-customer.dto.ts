import {CustomerResource, CustomerType} from "@prisma/client";
import {IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString} from "class-validator";
import {CreateProfileDto} from "../../../../common/dtos/create-profile.dto";

export class CreateCustomerDto extends CreateProfileDto {
  @IsNotEmpty()
  @IsEnum(CustomerType)
  readonly type: CustomerType;

  @IsNotEmpty()
  @IsEnum(CustomerResource)
  readonly resource: CustomerResource;

  @IsOptional()
  @IsBoolean()
  readonly isPotential: boolean;

  @IsOptional()
  @IsString()
  readonly note: string;
}
