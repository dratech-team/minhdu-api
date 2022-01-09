import {IsNotEmpty, IsString} from "class-validator";

export class CreateWarehouseDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
