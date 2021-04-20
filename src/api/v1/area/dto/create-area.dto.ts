import {IsNotEmpty, IsString} from "class-validator";

export class CreateAreaDto {
  @IsNotEmpty()
  @IsString()
  readonly area: string;
}
