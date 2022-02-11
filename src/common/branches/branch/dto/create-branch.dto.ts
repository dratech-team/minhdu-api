import {IsArray, IsNotEmpty, IsOptional, IsString, MinLength} from "class-validator";

export class CreateBranchDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsArray()
  readonly positionIds: number[];
}
