import {IsOptional, IsString} from "class-validator";

export class SearchBranchDto {
  @IsOptional()
  @IsString()
  readonly search: string;
}
