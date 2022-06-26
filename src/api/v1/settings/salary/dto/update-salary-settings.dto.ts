import { PartialType } from '@nestjs/swagger';
import { CreateSalarySettingsDto } from './create-salary-settings.dto';

export class UpdateSalarySettingsDto extends PartialType(CreateSalarySettingsDto) {}
