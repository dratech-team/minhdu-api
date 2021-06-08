import {ICreateSalaryDto} from "../../../../common/dtos/create-salary.dto";
import {Type} from "class-transformer";
import {IsOptional, MaxDate} from "class-validator";
import {ValidatorMessage} from "../../../../common/constant/validator.constant";

export class CreateSalaryDto extends ICreateSalaryDto {
  @Type(() => Date)
  @IsOptional()
  @MaxDate(new Date(), {message: ValidatorMessage.datetime})
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
