import {IsArray, IsNotEmpty, IsNumber, IsString} from "class-validator";
import {Type} from "class-transformer";

export class CreatePositionDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsArray()
  departmentIds: number[];
}
