import {PartialType} from "@nestjs/mapped-types";
import {ICreateSalaryDto} from "./create-salary.dto";

export class IUpdateSalaryDto extends PartialType(ICreateSalaryDto) {
}
