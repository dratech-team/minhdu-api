import { PartialType } from '@nestjs/swagger';
import { CreateSalaryv2Dto } from './create-salaryv2.dto';

export class UpdateSalaryv2Dto extends PartialType(CreateSalaryv2Dto) {}
