import {IsNotEmpty, IsString} from "class-validator";

export class CreateAreaDto {
  code: string;

  @IsNotEmpty()
  @IsString()
  readonly area: string;
}
