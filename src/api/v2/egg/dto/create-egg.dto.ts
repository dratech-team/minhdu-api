import {IsNotEmpty, IsNumber} from "class-validator";
import {Type} from "class-transformer";

export class CreateEggDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly eggTypeId: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly amount: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly incubatorId: number;


}
