import {IsEnum, IsOptional, IsString} from "class-validator";
import {OrderbyEmployeeEnum} from "../../api/v1/employee/enums/orderby-employee.enum";

export class SortDto {
  @IsOptional()
  @IsString()
  readonly orderType: "asc" | "desc";

  @IsOptional()
  @IsString()
  readonly orderBy: OrderbyEmployeeEnum;
}
