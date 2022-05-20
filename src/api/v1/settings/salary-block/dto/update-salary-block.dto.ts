import { PartialType } from '@nestjs/swagger';
import { CreateSalaryBlockDto } from './create-salary-block.dto';

export class UpdateSalaryBlockDto extends PartialType(CreateSalaryBlockDto) {}
