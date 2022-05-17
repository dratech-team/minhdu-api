import {IsNotEmpty, IsNumber} from "class-validator";
import {Type} from "class-transformer";
import {OmitType} from "@nestjs/mapped-types";
import {CreateSalaryv2Dto} from "./create-salaryv2.dto";

export class CreateManySalaryv2Dto extends OmitType(CreateSalaryv2Dto, ["payrollId"]) {
  @IsNotEmpty({message: "Bạn phải chọn ít nhất 1 phiếu lương"})
  @IsNumber({allowNaN: false}, {each: true})
  @Type(() => Number)
  readonly payrollIds: number[];
}
