import { Type } from "class-transformer";
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from "class-validator";

export class CreatePositionDto {
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  readonly positionId: number;

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @Type(() => Number)
  @IsOptional()
  readonly workday: number;
}
