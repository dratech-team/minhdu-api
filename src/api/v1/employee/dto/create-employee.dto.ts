import {ICreateUserDto} from "../../../../common/dtos/create-user.dto";
import {ObjectId} from "mongodb";
import {IsMongoId, IsNotEmpty, IsObject} from "class-validator";
import {Type} from "class-transformer";
import {ICreateSalaryDto} from "../../../../common/dtos/create-salary.dto";


export class CreateEmployeeDto extends ICreateUserDto {
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
