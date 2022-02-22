import {IsEnum, IsNotEmpty, IsNumber} from "class-validator";
import {Type} from "class-transformer";
import {EggType} from "@prisma/client";

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
}
