import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";

export class CreateSocialDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly id: number;

  @IsOptional()
  @IsString()
  readonly facebook: string;

  @IsOptional()
  @IsString()
  readonly zalo: string;
}
