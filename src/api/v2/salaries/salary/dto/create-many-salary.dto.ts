import {IsNotEmpty, IsNumber} from "class-validator";
import {Type} from "class-transformer";
import {OmitType} from "@nestjs/mapped-types";
import {CreateSalaryDto} from "./create-salary.dto";

export class CreateManySalaryDto extends OmitType(CreateSalaryDto, ["payrollId"]) {
  @IsNotEmpty({message: "Bạn phải chọn ít nhất 1 phiếu lương"})
  @IsNumber({allowNaN: false}, {each: true})
  @Type(() => Number)
  readonly payrollIds: number[];
}
