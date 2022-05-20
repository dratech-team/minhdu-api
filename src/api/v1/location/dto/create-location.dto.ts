import {IsNotEmpty, IsNumber, IsString} from "class-validator";
import {Type} from "class-transformer";

export class CreateLocationDto {
  @IsNotEmpty()
  @IsString()
  readonly latitude: string;

  @IsNotEmpty()
  @IsString()
  readonly longitude: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  readonly routeId: number;
}
