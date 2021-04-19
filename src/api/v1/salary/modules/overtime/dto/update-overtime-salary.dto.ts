import {PartialType} from "@nestjs/mapped-types";
import {CreateOvertimeSalaryDto} from "./create-overtime-salary.dto";

export class UpdateOvertimeSalaryDto extends PartialType(CreateOvertimeSalaryDto) {
}
