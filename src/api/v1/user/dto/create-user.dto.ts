import {ICreateUserDto} from "../../../../common/dtos/create-user.dto";
import {ObjectId} from "mongodb";
import {IsMongoId, IsNotEmpty} from "class-validator";
import {Type} from "class-transformer";

export class CreateUserDto extends ICreateUserDto {
  @IsNotEmpty()
  @IsMongoId()
  position: ObjectId;

  @Type(() => ObjectId)
  @IsNotEmpty()
  @IsMongoId()
  department: ObjectId;

  @Type(() => ObjectId)
  @IsNotEmpty()
  @IsMongoId()
  branch: ObjectId;
}
