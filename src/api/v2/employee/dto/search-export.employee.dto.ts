import {PartialType} from "@nestjs/mapped-types";
import {SearchEmployeeDto} from "./search-employee.dto";
import {IsNotEmpty, IsString} from "class-validator";

export class SearchExportEmployeeDto extends PartialType(SearchEmployeeDto){
  @IsNotEmpty()
  @IsString()
  readonly filename: string;
}
