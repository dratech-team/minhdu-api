import {IsOptional} from "class-validator";
import {ObjectId} from "mongodb";

export class CreatePayrollDto {
  @IsOptional()
  readonly basics: ObjectId[];
}
