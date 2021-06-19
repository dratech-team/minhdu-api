import {IsNotEmpty, IsOptional, IsString, MinLength} from "class-validator";

export class CreateBranchDto {
  @IsOptional()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(7)
  readonly name: string;
}
