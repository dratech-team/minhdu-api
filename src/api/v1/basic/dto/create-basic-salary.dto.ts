import {ICreateSalaryDto} from "../../../../common/dtos/create-salary.dto";
import {ObjectId} from "mongodb";
import {Type} from "class-transformer";
import {IsMongoId} from "class-validator";

export class CreateBasicSalaryDto extends ICreateSalaryDto {
  @Type(() => ObjectId)
  @IsMongoId()
  userId: ObjectId;
}
