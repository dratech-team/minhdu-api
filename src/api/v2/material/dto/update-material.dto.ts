import {CreateMaterialDto} from './create-material.dto';
import {PartialType} from "@nestjs/mapped-types";

export class UpdateMaterialDto extends PartialType(CreateMaterialDto) {
}
