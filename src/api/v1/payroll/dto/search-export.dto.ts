import {FilterTypeEnum} from "../entities/filter-type.enum";
import {IsEnum, IsNotEmpty, IsString} from "class-validator";
import {PartialType} from "@nestjs/swagger";
import {SearchPayrollDto} from "./search-payroll.dto";

export class SearchExportDto extends PartialType(SearchPayrollDto) {
  @IsNotEmpty()
  @IsString()
  readonly filename: string;

  @IsNotEmpty()
  @IsEnum(FilterTypeEnum)
  readonly exportType: FilterTypeEnum;
}
