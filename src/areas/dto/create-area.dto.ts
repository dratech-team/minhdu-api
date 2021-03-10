import {
  IsString,
  Length,
  IsEmail,
  IsNotEmpty,
  IsNumber
} from "class-validator";

export class CreateAreaDto {
  @IsString()
  @Length(1, 200)
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @Length(1, 100)
  @IsNotEmpty()
  readonly code: string;

  @IsNumber()
  @IsNotEmpty()
  readonly status: string;

  @IsString()
  readonly address: string;
}
