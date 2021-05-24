import {IsNotEmpty, IsNumber, IsString} from "class-validator";
import {Type} from "class-transformer";

export class CreateDiagramDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  workday: number;
}
