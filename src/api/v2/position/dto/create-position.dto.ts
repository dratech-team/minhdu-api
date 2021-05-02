import {IsArray, IsNotEmpty, IsNumber, IsString} from "class-validator";
import {Type} from "class-transformer";

export class CreatePositionDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  workday: number;

  @IsNotEmpty()
  @IsArray()
  departmentIds: number[];
}
