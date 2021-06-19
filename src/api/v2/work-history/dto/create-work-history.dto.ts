import {Type} from "class-transformer";
import {IsDate, IsNotEmpty, IsNumber, MaxDate} from "class-validator";
import {ValidatorMessage} from "../../../../common/constant/validator.constant";

export class CreateWorkHistoryDto {
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  readonly branchId: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  readonly departmentId: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  readonly positionId: number;

  @Type(() => Date)
  @IsDate()
  @MaxDate(new Date(), {message: ValidatorMessage.datetime})
  readonly createdAt: Date;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  readonly employeeId: number;
}
