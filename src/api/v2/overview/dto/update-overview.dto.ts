import { PartialType } from '@nestjs/swagger';
import { CreateOverviewDto } from './create-overview.dto';

export class UpdateOverviewDto extends PartialType(CreateOverviewDto) {}
