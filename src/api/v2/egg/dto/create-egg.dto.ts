import {IsDate, IsEnum, IsNotEmpty, IsNumber} from "class-validator";
import {Transform, Type} from "class-transformer";
import {EggType} from "@prisma/client";
import * as moment from "moment";

export class CreateEggDto {
  @IsNotEmpty()
  @IsEnum(EggType)
  readonly eggType: EggType;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly amount: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly branchId: number;

  @IsNotEmpty()
  @IsDate()
  @Transform((val) => new Date(moment(val.value).format('YYYY-MM-DD')))
  readonly createdAt: Date;
}
