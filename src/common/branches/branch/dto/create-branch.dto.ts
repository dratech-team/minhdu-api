import {IsArray, IsNotEmpty, IsOptional, IsString, MinLength} from "class-validator";

export class CreateBranchDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(7)
  readonly name: string;

  @IsOptional()
  @IsArray()
  readonly positionIds: number[];
}
