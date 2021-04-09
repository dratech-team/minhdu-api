import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsNumber, IsNotEmpty, IsString } from "class-validator";
import { IPhone } from "../interfaces/phone.interface";
// import { IPhone } from "@/core/interfaces/phone.interface";

export class PhoneDto implements IPhone {
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    required: false,
  })
  countryCode: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  phoneNumber: string;

  constructor(phone: IPhone) {
    if (!phone) {
      return;
    }
    this.countryCode = phone.countryCode || null;
    this.phoneNumber = phone.phoneNumber || null;
  }
}
