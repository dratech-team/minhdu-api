import { PartialType } from '@nestjs/swagger';
import { CreateEggTypeDto } from './create-egg-type.dto';

export class UpdateEggTypeDto extends PartialType(CreateEggTypeDto) {}
