import {CreateNationDto} from './create-nation.dto';
import {PartialType} from "@nestjs/mapped-types";

export class UpdateNationDto extends PartialType(CreateNationDto) {
}
