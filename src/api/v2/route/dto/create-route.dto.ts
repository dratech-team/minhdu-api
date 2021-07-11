import {IsArray, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested} from "class-validator";
import {Transform, Type} from "class-transformer";
import {CreateLocationDto} from "../../location/dto/create-location.dto";

export class CreateRouteDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @Type(() => Date)
  @Transform((val) => new Date(val.value))
  @IsDate()
  readonly startedAt: Date;

  @IsOptional()
  @Type(() => Date)
  @Transform((val) => new Date(val.value))
  @IsDate()
  readonly endedAt: Date;

  @IsOptional()
  @IsString()
  readonly driver: string;

  @IsOptional()
  @IsString()
  readonly garage: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly employeeId: number;

  @IsOptional()
  @IsArray()
  readonly orderIds: number[];

  @IsNotEmpty()
  @IsString()
  readonly bsx: string;
}
