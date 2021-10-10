import {IsBoolean, IsDate, IsNotEmpty} from "class-validator";
import {Transform, Type} from "class-transformer";

export class CreateSystemDto {
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @Transform((val) => new Date(val.value))
  readonly maintainedHr: Date;
}
