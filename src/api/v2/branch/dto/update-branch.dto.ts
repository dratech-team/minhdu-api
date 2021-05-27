import {CreateBranchDto} from './create-branch.dto';
import {PartialType} from "@nestjs/mapped-types";

export class UpdateBranchDto extends PartialType(CreateBranchDto) {
}
