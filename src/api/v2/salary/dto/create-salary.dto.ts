import {ICreateSalaryDto} from "../../../../common/dtos/create-salary.dto";
import {Type} from "class-transformer";
import {IsArray, IsNumber, IsOptional,} from "class-validator";

export class CreateSalaryDto extends ICreateSalaryDto {
    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    readonly payrollId?: number;
}

export class CreateSalaryEmployeesDto extends CreateSalaryDto {
    @IsOptional()
    @IsArray()
    readonly employeeIds?: number[];
}
