import {IsNotEmpty, IsOptional, IsString} from "class-validator";

export class CreateBankDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly owner: string;

  @IsOptional()
  @IsString()
  readonly stk: string;

  @IsNotEmpty()
  @IsString()
  readonly employeeId: number;
}
