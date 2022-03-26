import {EmployeeType, RecipeType} from "@prisma/client";
import {Transform, Type} from "class-transformer";
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxDate,
  ValidateNested,
} from "class-validator";
import {ValidatorMessage} from "../../../../common/constant/validator.constant";
import {CreateProfileDto} from "../../../../common/dtos/create-profile.dto";
import {tomorrowDate} from "../../../../utils/datetime.util";
import {CreateContractDto} from "../../contract/dto/create-contract.dto";
import {CreateSocialDto} from "./create-social.dto";
import * as moment from "moment";

export class CreateEmployeeDto extends CreateProfileDto {
  @IsNotEmpty({message: 'Ngày vào làm không được để trống. Để tránh ảnh hưởng tới việc tạo tự động phiếu lương xảy ra sai sót.. Xin cảm ơn'})
  @Type(() => Date)
  @Transform((val) => new Date(moment(val.value).format('YYYY-MM-DD')))
  @IsDate()
  readonly createdAt: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @Transform((val) => new Date(moment(val.value).format('YYYY-MM-DD')))
  readonly workedAt: Date;

  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  readonly isFlatSalary: boolean;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  readonly branchId: number;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  readonly positionId: number;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  readonly workday: number;

  @IsOptional()
  @ValidateNested()
  readonly social: CreateSocialDto;

  @IsOptional()
  @IsEmail()
  readonly email: string;

  @IsOptional()
  @IsString()
  readonly note: string;

  @IsOptional()
  @IsEnum(RecipeType)
  readonly recipeType: RecipeType;

  @IsOptional()
  @IsEnum(EmployeeType)
  readonly type: EmployeeType;

  @IsOptional()
  contract: CreateContractDto;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly categoryId: number;
}
