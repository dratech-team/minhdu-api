import {CreateDegreeDto} from './create-degree.dto';
import {PartialType} from "@nestjs/mapped-types";

export class UpdateDegreeDto extends PartialType(CreateDegreeDto) {
}
