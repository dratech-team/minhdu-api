import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";

export class CreateOrderHistoryDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly orderId: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly price: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly amount: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly gift: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly more: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Date)
  readonly confirmedAt?: Date | null;

  @IsOptional()
  @IsString()
  readonly note?: string;
}
