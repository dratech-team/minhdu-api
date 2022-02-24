import {IsBoolean, IsNotEmpty, IsString} from "class-validator";
import {Type} from "class-transformer";

export class CreateEggTypeDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsBoolean()
  @Type(() => Boolean)
  readonly rated: boolean;
}
