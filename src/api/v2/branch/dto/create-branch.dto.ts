import {IsArray, IsNotEmpty, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";

export class CreateBranchDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @Type(() => Number)
  areaId: number;

  @IsOptional()
  @IsArray()
  departmentIds: number[]
}
