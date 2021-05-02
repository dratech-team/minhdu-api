import {IsNotEmpty, IsString} from "class-validator";

export class SignInCredentialDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

