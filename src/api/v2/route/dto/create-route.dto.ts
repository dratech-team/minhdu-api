import {IsArray, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, MaxDate} from "class-validator";
import {Type} from "class-transformer";
import * as moment from "moment";
import {tomorrowDate} from "../../../../utils/datetime.util";

export class CreateRouteDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  readonly startedAt: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @MaxDate(tomorrowDate())
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
