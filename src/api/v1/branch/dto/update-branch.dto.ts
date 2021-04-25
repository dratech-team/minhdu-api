import {PartialType} from '@nestjs/swagger';
import {CreateBranchDto} from './create-branch.dto';
import {IsMongoId, IsOptional} from "class-validator";
import {ObjectId} from "mongodb";
import {Type} from "class-transformer";

export class UpdateBranchDto extends PartialType(CreateBranchDto) {
  @Type(() => ObjectId)
  @IsMongoId()
  @IsOptional()
  departmentId: ObjectId;
}
