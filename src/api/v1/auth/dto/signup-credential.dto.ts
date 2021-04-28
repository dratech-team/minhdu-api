import {IsEnum, IsMongoId, IsNotEmpty, IsString} from "class-validator";
import {ObjectId} from "mongodb";
import {UserType} from "../../../../core/constants/role-type.constant";

export class SignupCredentialDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsEnum(UserType)
  role: UserType;

  @IsMongoId()
  @IsNotEmpty()
  userId: ObjectId;
}
