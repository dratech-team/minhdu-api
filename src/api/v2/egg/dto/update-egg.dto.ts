import { PartialType } from '@nestjs/swagger';
import { CreateEggDto } from './create-egg.dto';

export class UpdateEggDto extends PartialType(CreateEggDto) {}
