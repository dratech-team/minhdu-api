import {PartialType} from "@nestjs/swagger";
import {CreateRemoteDto} from "./create-remote.dto";
import {IsArray, IsNotEmpty, IsNumber} from "class-validator";
import {Type} from "class-transformer";

export class UpdateManyRemoteDto extends PartialType(CreateRemoteDto) {
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, {each: true})
  @Type(() => Number)
  readonly salaryIds: number[];
}
