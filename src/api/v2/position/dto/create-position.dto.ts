import {IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min, MinLength} from "class-validator";

export class CreatePositionDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsNumber()
  @Max(31, {message: 'Ngày làm việc chuẩn phải nhỏ hơn 31 ngày'})
  @Min(1, {message: 'Ngày làm việc chuẩn phải lớn hơn 0'})
  readonly workday: number;

  @IsNotEmpty()
  @IsNumber()
  readonly departmentId: number;
}
