import {PartialType} from "@nestjs/mapped-types";
import {CreateOvertimeDto} from "./create-overtime.dto";

export class UpdateOvertimeDto extends PartialType(CreateOvertimeDto) {

}