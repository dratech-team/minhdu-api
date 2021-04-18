import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";
import { UserType } from "../../../../core/constants/role-type.constant";

export class UpdatePositionDto {
  @IsString()
  @IsOptional()
  readonly position: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  readonly wordDay: number;

  @IsEnum(UserType)
  @IsOptional()
  readonly userType: UserType;
}
