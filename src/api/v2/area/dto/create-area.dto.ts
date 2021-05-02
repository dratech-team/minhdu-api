import {IsNotEmpty, IsObject, IsString} from "class-validator";
import {CreateBranchDto} from "../../branch/dto/create-branch.dto";

export class CreateAreaDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
