import {TypeEnum} from "../entities/type.enum";
import {IsEnum, IsNotEmpty} from "class-validator";

export class SearchAdminDto {
  @IsNotEmpty()
  @IsEnum(TypeEnum)
  readonly type: TypeEnum;
}
