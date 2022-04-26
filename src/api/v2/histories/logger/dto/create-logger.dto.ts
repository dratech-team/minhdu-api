import { AppEnum} from "@prisma/client";
import {IsEnum, IsOptional, IsString} from "class-validator";

export class CreateLoggerDto {
  @IsEnum(AppEnum)
  readonly appName: AppEnum;

  @IsString()
  readonly name: string;

  @IsString()
  readonly activity: string;

  @IsString()
  readonly description: string;

  @IsOptional()
  readonly ip?: string;
}
