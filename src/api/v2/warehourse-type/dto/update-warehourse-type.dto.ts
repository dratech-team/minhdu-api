import { PartialType } from '@nestjs/swagger';
import { CreateWarehourseTypeDto } from './create-warehourse-type.dto';

export class UpdateWarehourseTypeDto extends PartialType(CreateWarehourseTypeDto) {}
