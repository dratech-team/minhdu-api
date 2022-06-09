import { PartialType } from '@nestjs/mapped-types';
import { CreateSalarySettingsDto } from './create-salary-settings.dto';

export class UpdateSalarySettingsDto extends PartialType(CreateSalarySettingsDto) {}
