import {PartialType} from "@nestjs/mapped-types";
import {CreateOtherSalaryDto} from "./create-other-salary";

export class UpdateOtherSalaryDto extends PartialType(CreateOtherSalaryDto) {
}
