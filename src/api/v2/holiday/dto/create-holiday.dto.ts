import {IsArray, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Transform, Type} from "class-transformer";

export class CreateHolidayDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  readonly datetime: Date;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  readonly rate: number;

  @IsOptional()
  @IsArray()
  readonly positionIds: number[];
}
