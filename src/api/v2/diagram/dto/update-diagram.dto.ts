import { PartialType } from '@nestjs/swagger';
import { CreateDiagramDto } from './create-diagram.dto';

export class UpdateDiagramDto extends PartialType(CreateDiagramDto) {}
