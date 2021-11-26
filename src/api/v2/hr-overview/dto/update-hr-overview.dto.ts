import { PartialType } from '@nestjs/swagger';
import { CreateHrOverviewDto } from './create-hr-overview.dto';

export class UpdateHrOverviewDto extends PartialType(CreateHrOverviewDto) {}
