import { CreateSalaryHistoryDto } from './create-salary-history.dto';
import {PartialType} from "@nestjs/mapped-types";

export class UpdateSalaryHistoryDto extends PartialType(CreateSalaryHistoryDto) {}
