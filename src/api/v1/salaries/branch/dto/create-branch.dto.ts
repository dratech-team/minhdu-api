import {IsDate, IsNotEmpty, IsNumber, IsString} from "class-validator";
import {Transform, Type} from "class-transformer";
import * as moment from "moment";

export class CreateBranchSalaryDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly price: number;

  @IsNotEmpty()
  @IsDate()
  @Transform(({value}) => {
    return new Date(moment(value).utc().format('YYYY-MM-DD'));
  })
  readonly datetime: Date;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly branchId: number;
}
