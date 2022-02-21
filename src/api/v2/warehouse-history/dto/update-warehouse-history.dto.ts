import { PartialType } from '@nestjs/swagger';
import { CreateWarehouseHistoryDto } from './create-warehouse-history.dto';

export class UpdateWarehouseHistoryDto extends PartialType(CreateWarehouseHistoryDto) {}
