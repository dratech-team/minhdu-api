import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsBoolean } from "class-validator";

export class UpdateResponseDto {
  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  isSuccess: boolean;

  constructor(isSuccess?: boolean) {
    this.isSuccess = isSuccess;
  }
}
