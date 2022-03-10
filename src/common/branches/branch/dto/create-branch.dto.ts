import {IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";

export class CreateBranchDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsArray()
  readonly positionIds: number[];

  @IsOptional()
  @IsString()
  readonly phone: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  readonly status: boolean;

  @IsOptional()
  @IsString()
  readonly address: string;
}
