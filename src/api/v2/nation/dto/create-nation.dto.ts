import {IsNotEmpty, IsString} from "class-validator";

export class CreateNationDto {
  @IsNotEmpty()
  @IsString()
  readonly code: string;

  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
