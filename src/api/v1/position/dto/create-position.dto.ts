import {
  IsEnum, IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from "class-validator";
import {Type} from "class-transformer";
import {UserType} from "../../../../core/constants/role-type.constant";
import {User} from "../../user/schema/user.schema";
import {ObjectId} from "mongodb";

export class CreatePositionDto {
  @IsString()
  @IsNotEmpty()
  readonly position: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  readonly wordDay: number;

  @Type(() => ObjectId)
  @IsNotEmpty()
  @IsMongoId()
  readonly departmentId: ObjectId;
}
