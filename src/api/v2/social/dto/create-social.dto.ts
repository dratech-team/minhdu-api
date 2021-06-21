import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";

export class CreateSocialDto {
  @IsOptional()
  @IsString()
  readonly facebook: string;

  @IsOptional()
  @IsString()
  readonly zalo: string;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  readonly employeeId: number;
}
