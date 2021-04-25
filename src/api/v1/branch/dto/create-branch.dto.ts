import {IsNotEmpty, IsString} from "class-validator";

export class CreateBranchDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
