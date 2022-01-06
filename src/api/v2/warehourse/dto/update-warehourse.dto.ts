import { PartialType } from '@nestjs/swagger';
import { CreateWarehourseDto } from './create-warehourse.dto';

export class UpdateWarehourseDto extends PartialType(CreateWarehourseDto) {}
