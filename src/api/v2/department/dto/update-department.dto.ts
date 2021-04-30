import {CreateDepartmentDto} from './create-department.dto';
import {OmitType, PartialType} from "@nestjs/mapped-types";
import {IsArray, IsOptional} from "class-validator";

export class UpdateDepartmentDto extends PartialType(OmitType(CreateDepartmentDto, ['positions'] as const)) {
  @IsOptional()
  @IsArray()
  positionIds: number[]
}
