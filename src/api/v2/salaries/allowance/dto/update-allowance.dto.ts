import { PartialType } from '@nestjs/mapped-types';
import { CreateAllowanceDto } from './create-allowance.dto';

export class UpdateAllowanceDto extends PartialType(CreateAllowanceDto) {}
