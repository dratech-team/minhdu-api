import {TypeEnum} from "../entities/type.enum";
import {IsEnum, IsNotEmpty, IsNumber, IsOptional} from "class-validator";
import {Type} from "class-transformer";

export class SearchAdminDto {
  @IsNotEmpty()
  @IsEnum(TypeEnum)
  readonly type: TypeEnum;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly year: number;
}
