import {IsNotEmpty, IsString, MinLength} from "class-validator";

export class SignInCredentialDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5, {message: "Tên đăng nhập phải có ít nhất 5 ký tự"})
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, {message: "Mật khẩu phải có ít nhất 6 ký tự"})
  password: string;
}

