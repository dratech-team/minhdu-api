import { PartialType } from '@nestjs/swagger';
import { CreateLoggerDto } from './create-logger.dto';

export class UpdateLoggerDto extends PartialType(CreateLoggerDto) {}
