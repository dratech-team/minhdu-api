import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class CreatePositionDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  workday: number;

  @IsNotEmpty()
  @IsNumber()
  departmentId: number;
}
