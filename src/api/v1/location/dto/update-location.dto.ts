import {CreateLocationDto} from './create-location.dto';
import {PartialType} from "@nestjs/mapped-types";

export class UpdateLocationDto extends PartialType(CreateLocationDto) {
}
