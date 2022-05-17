import {PartialType} from "@nestjs/mapped-types";
import {CreateBranchSalaryDto} from "./create-branch.dto";

export class UpdateBranchSalaryDto extends PartialType(CreateBranchSalaryDto) {
}
