import {IsEnum, IsNotEmpty, IsNumber} from "class-validator";
import {Type} from "class-transformer";
import {CancelTypeEnum} from "../enums/cancel-type.enum";

export class CancelRouteDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly desId: number;

  @IsNotEmpty()
  @IsEnum(CancelTypeEnum)
  readonly cancelType: CancelTypeEnum;
}
