import {PartialType} from "@nestjs/mapped-types";
import {ICreateUserDto} from "./create-user.dto";

export class IUpdateUserDto extends PartialType(ICreateUserDto) {
}
