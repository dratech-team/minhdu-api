import {PartialType} from '@nestjs/mapped-types';
import {IsArray, IsNumber} from "class-validator";
import {CreateSalaryDto} from "./create-salary.dto";

export class UpdateSalaryDto extends PartialType(CreateSalaryDto) {
}
