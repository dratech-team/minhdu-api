import { PartialType } from '@nestjs/swagger';
import {CreateSalaryHistoryDto} from "./create-salary-history.dto";

export class UpdateSalaryHistoryDto extends PartialType(CreateSalaryHistoryDto) {}
