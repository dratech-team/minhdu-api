import {CreateRemoteDto} from "./create-remote.dto";
import {IsArray, IsNotEmpty, IsNumber} from "class-validator";
import {Type} from "class-transformer";
import { PartialType } from "@nestjs/mapped-types";

export class UpdateManyRemoteDto extends PartialType(CreateRemoteDto) {
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, {each: true})
  @Type(() => Number)
  readonly salaryIds: number[];
}
