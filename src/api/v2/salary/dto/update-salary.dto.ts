import {ICreateSalaryDto} from "../../../../common/dtos/create-salary.dto";
import {PartialType} from "@nestjs/mapped-types";

export class UpdateSalaryDto extends PartialType(ICreateSalaryDto) {}
