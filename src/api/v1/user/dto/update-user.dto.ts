import {PartialType} from "@nestjs/mapped-types";
import {CreateUserDto} from "./create-user.dto";
import {IsOptional} from "class-validator";
import { IUpdateSalaryDto } from "src/common/dtos/update-salary.dto";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  basicSalary: IUpdateSalaryDto;
}
