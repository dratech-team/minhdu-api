import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { UserType } from "../../../../core/constants/role-type.constant";
import { User } from "../../user/schema/user.schema";

export class CreatePositionDto {
  @IsString()
  @IsNotEmpty()
  readonly position: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  readonly wordDay: number;

  @IsEnum(UserType)
  @IsNotEmpty()
  readonly userType: UserType;

  @ValidateNested()
  readonly userId: User;
}
