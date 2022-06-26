import { PartialType } from '@nestjs/swagger';
import { CreateConsignmentDto } from './create-consignment.dto';

export class UpdateConsignmentDto extends PartialType(CreateConsignmentDto) {}
