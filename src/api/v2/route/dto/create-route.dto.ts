import {IsArray, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Transform, Type} from "class-transformer";
import * as moment from "moment";

export class CreateRouteDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @Transform((val) => new Date(moment(val.value).format('YYYY-MM-DD')))
  readonly startedAt: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @Transform((val) => new Date(moment(val.value).format('YYYY-MM-DD')))
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
