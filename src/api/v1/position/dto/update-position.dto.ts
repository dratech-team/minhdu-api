import { IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

export class UpdatePositionDto {
  @IsString()
  @IsOptional()
  readonly position: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  readonly workDay: number;
}
