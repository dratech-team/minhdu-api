import { PartialType } from '@nestjs/swagger';
import { CreateSystemHistoryDto } from './create-system-history.dto';

export class UpdateSystemHistoryDto extends PartialType(CreateSystemHistoryDto) {}
