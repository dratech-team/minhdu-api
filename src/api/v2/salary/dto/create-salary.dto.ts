import {ICreateSalaryDto} from "../../../../common/dtos/create-salary.dto";
import {Type} from "class-transformer";
import {IsOptional} from "class-validator";

export class CreateSalaryDto extends ICreateSalaryDto {
  @Type(() => Date)
  @IsOptional()
  datetime: Date;

  @IsOptional()
  @Type(() => Number)
  times: number

  @IsOptional()
  @Type(() => Number)
  rate: number;

  @IsOptional()
  @Type(() => Boolean)
  forgot: boolean;
}
