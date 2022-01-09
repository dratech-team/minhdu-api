import {IsNotEmpty, IsString} from "class-validator";

export class CreateProviderDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string
}
