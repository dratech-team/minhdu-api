import {IsArray, IsNotEmpty, IsNumber} from "class-validator";
import {Type} from "class-transformer";
import {OmitType} from "@nestjs/mapped-types";
import {CreateRemoteDto} from "./create-remote.dto";

export class CreateManyRemoteDto extends OmitType(CreateRemoteDto, ["payrollId"]) {
  @IsNotEmpty()
  @IsNumber({}, {each: true})
  @IsArray()
  @Type(() => Number)
  readonly payrollIds: number[];
}
