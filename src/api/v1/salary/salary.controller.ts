import { Body, Controller, Post } from "@nestjs/common";
import { SalaryService } from "./salary.service";
import { CreateSalaryDto } from "./dto/create-salary.dto";
import { SalaryEntity } from "./entities/salarySchema";

@Controller("v1/salary")
export class SalaryController {
  constructor(private readonly salaryService: SalaryService) { }

  @Post()
  create(@Body() createSalaryDto: CreateSalaryDto): Promise<SalaryEntity> {
    return this.salaryService.create(createSalaryDto);
  }
}
