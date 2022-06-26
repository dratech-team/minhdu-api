import {IsEnum, IsNotEmpty, IsNumber} from "class-validator";
import {Type} from "class-transformer";

enum TypeEnum {
  ORDER = "ORDER",
  COMMODITY = "COMMODITY",
}

export class CancelRouteDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly desId: number;

  @IsNotEmpty()
  @IsEnum(TypeEnum)
  readonly cancelType: TypeEnum;
}
