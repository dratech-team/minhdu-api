import {ICreateUserDto} from "../../../../common/dtos/create-user.dto";
import {ObjectId} from "mongodb";
import {IsMongoId, IsNotEmpty, IsNumber, IsObject} from "class-validator";
import {Type} from "class-transformer";
import {ICreateSalaryDto} from "../../../../common/dtos/create-salary.dto";


export class CreateEmployeeDto extends ICreateUserDto {
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  workday: number;

  @IsNotEmpty()
  @IsMongoId()
  positionId: ObjectId;

  @Type(() => ObjectId)
  @IsNotEmpty()
  @IsMongoId()
  departmentId: ObjectId;

  @Type(() => ObjectId)
  @IsNotEmpty()
  @IsMongoId()
  branchId: ObjectId;


  @IsNotEmpty()
  @IsObject()
  basicSalary: ICreateSalaryDto;
}
