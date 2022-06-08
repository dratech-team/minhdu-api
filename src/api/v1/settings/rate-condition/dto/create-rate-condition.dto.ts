import {IsEnum, IsNotEmpty, IsNumber, Max, Min, Validate} from "class-validator";
import {ConditionType, RateConditionType} from "@prisma/client";
import {WithValidator} from "../validators/with.validator";

export class CreateRateConditionDto {
  @IsNotEmpty()
  @IsEnum(ConditionType)
  readonly condition: ConditionType;

  @IsNotEmpty()
  @Validate(WithValidator)
  @Min(0)
  @Max(31)
  readonly with: number;

  @IsNotEmpty()
  @IsEnum(RateConditionType)
  readonly type: RateConditionType;

  @IsNotEmpty()
  @IsNumber()
  readonly default: number;
}
