import { PartialType } from '@nestjs/swagger';
import { CreateImportExportDto } from './create-import-export.dto';

export class UpdateImportExportDto extends PartialType(CreateImportExportDto) {}
