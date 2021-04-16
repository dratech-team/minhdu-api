import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Type } from "class-transformer";

export class CreatePositionDto {
  @IsString()
  @IsNotEmpty()
  readonly position: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  readonly workDay: number;
}
