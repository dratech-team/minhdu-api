import {PartialType} from '@nestjs/swagger';
import {ICreateSalaryDto} from "../../../../common/dtos/create-salary.dto";

export class UpdateSalaryDto extends PartialType(ICreateSalaryDto) {}
