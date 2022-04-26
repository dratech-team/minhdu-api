import {IsEnum, IsOptional, IsString} from "class-validator";
import {OrderbyEmployeeEnum} from "../../api/v2/employee/enums/orderby-employee.enum";

export class SortDto {
  @IsOptional()
  @IsString()
  readonly orderType: "asc" | "desc";

  @IsOptional()
  @IsEnum(OrderbyEmployeeEnum)
  readonly orderBy: OrderbyEmployeeEnum;
}
