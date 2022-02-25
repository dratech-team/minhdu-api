import { PartialType } from '@nestjs/swagger';
import {CreateWarehouseHistoryDto} from "./inventory-warehouse-history.dto";

export class UpdateWarehouseHistoryDto extends PartialType(CreateWarehouseHistoryDto) {}
