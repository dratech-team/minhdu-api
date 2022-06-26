import {IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Transform, Type} from "class-transformer";
import {PartialDay, SalaryType} from "@prisma/client";
import * as moment from "moment";

export class CreateSalaryDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly payrollId: number;

  @IsOptional({message: "Bạn phải nhập đơn giá", groups: ["basic", "stay"]})
  @IsNumber()
  @Type(() => Number)
  readonly price: number;

  @IsNotEmpty({message: "Bạn phải nhập tiêu đề"})
  @IsString()
  readonly title: string;

  @IsOptional()
  @IsNumber({}, {each: true})
  @Type(() => Number)
  readonly blockId: number;

  @IsNotEmpty({message: "Bạn phải loại lương"})
  @IsEnum(SalaryType)
  readonly type: SalaryType;

  @IsOptional()
  @IsString()
  readonly note: string;
}
