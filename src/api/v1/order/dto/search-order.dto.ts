import {PaidEnum} from "../enums/paid.enum";
import {Customer, PaymentType} from "@prisma/client";
import {IsEnum, IsNumber, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";
import {SearchRangeDto} from "../../../../common/dtos/search-range.dto";

export class SearchOrderDto extends SearchRangeDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly skip: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly take: number;

  @IsOptional()
  @IsString()
  readonly commodity: string;

  @IsOptional()
  readonly paidType: PaidEnum;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly customerId: Customer["id"];

  @IsOptional()
  @IsString()
  readonly customer: string;

  @IsOptional()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly province: string;

  @IsOptional()
  @IsEnum(PaymentType)
  readonly payType: PaymentType;

  @IsOptional()
  @IsNumber()
  @Type((v) => Number)
  readonly status: 0 | 1 | -1;

  @IsOptional()
  @IsNumber({}, {each: true})
  @Type(() => Number)
  readonly hiddenDebt: 0 | 1 | -1;


  @IsOptional()
  readonly filterRoute: string;
}
