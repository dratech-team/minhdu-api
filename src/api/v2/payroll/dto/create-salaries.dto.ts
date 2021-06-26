import {IsArray, IsNotEmpty, ValidateNested} from "class-validator";
import {CreateSalaryDto} from "../../salary/dto/create-salary.dto";

export class CreateSalariesDto extends CreateSalaryDto{
  @IsNotEmpty()
  @IsArray()
  readonly employeeIds: number[];
}
