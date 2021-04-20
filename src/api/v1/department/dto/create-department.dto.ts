import { IsNotEmpty, IsString } from "class-validator";

export class CreateDepartmentDto {
  @IsNotEmpty()
  @IsString()
  readonly department: string;
}
