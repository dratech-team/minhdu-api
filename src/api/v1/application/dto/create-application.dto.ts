import {AppEnum} from "@prisma/client";
import {IsEnum, IsNotEmpty, IsString} from "class-validator";

export class CreateApplicationDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsEnum(AppEnum)
  readonly app: AppEnum;

  @IsNotEmpty()
  @IsString()
  readonly link: string;

  @IsNotEmpty()
  @IsString()
  readonly icon: string;
}
