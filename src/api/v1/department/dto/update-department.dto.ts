import { IsOptional, IsString } from "class-validator";

export class UpdateDepartmentDto {
  @IsOptional()
  @IsString()
  readonly department: string;
}
