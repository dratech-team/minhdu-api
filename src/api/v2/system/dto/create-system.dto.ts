import {IsDate, IsEnum, IsNotEmpty, IsOptional, IsString} from "class-validator";
import {Transform, Type} from "class-transformer";
import {SystemType} from "@prisma/client";

export class CreateSystemDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsEnum(SystemType)
  readonly type: SystemType;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Transform((val) => new Date(val.value))
  readonly datetime: Date;
}
