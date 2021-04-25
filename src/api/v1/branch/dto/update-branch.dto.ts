import {PartialType} from '@nestjs/swagger';
import {CreateBranchDto} from './create-branch.dto';
import {IsOptional} from "class-validator";
import {ObjectId} from "mongodb";

export class UpdateBranchDto extends PartialType(CreateBranchDto) {
  @IsOptional()
  departmentIds: ObjectId[];
}
