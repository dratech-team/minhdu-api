import {IsNotEmpty, IsString} from "class-validator";

export class CreateBranchDto {
  code: string;

  @IsNotEmpty()
  @IsString()
  branch: string;
}
