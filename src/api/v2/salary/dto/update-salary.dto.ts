import { PartialType } from '@nestjs/swagger';
import { CreateSalaryDto } from './create-salary.dto';

export class UpdateSalaryDto extends PartialType(CreateSalaryDto) {}
