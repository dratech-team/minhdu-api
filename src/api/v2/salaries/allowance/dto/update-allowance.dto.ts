import {OmitType} from '@nestjs/mapped-types';
import {CreateAllowanceDto} from './create-allowance.dto';
import {IsArray, IsNotEmpty, IsNumber} from "class-validator";
import {Type} from "class-transformer";

export class UpdateAllowanceDto extends OmitType(CreateAllowanceDto, ["payrollId"]) {
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, {each: true})
  @Type(() => Number)
  readonly salaryIds: number[];
}
