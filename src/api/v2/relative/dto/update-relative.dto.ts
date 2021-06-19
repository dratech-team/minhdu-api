import {PartialType} from '@nestjs/mapped-types';
import {CreateRelativeDto} from './create-relative.dto';

export class UpdateRelativeDto extends PartialType(CreateRelativeDto) {
}
