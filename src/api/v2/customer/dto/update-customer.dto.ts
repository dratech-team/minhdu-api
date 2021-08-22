import {CreateCustomerDto} from './create-customer.dto';
import {PartialType} from "@nestjs/mapped-types";
import {IsNumber, IsOptional} from "class-validator";
import {Type} from "class-transformer";

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly debt: number;
}
