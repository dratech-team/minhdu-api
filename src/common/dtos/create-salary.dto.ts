import {IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";
import {ObjectId} from "mongodb";

export class ICreateSalaryDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsOptional()
  @IsString()
  note: string;
}
