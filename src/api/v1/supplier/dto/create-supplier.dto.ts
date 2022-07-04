import {IsNotEmpty, IsString} from "class-validator";

export class CreateSupplierDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
