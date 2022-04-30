import {OmitType} from "@nestjs/mapped-types";
import {CreateManyRemoteDto} from "./create-many-remote.dto";
import {IsNotEmpty, IsNumber} from "class-validator";
import {Type} from "class-transformer";

export class CreateRemoteDto extends OmitType(CreateManyRemoteDto, ["payrollIds"]) {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly payrollId: number;
}
