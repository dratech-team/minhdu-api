import { Body, Controller, Post } from "@nestjs/common";
import { SalaryService } from "./salary.service";
import { CreateSalaryDto } from "./dto/create-salary.dto";
import { SalaryInterface } from "./interfaces/salary.interface";

@Controller("v1/salary")
export class SalaryController {
  constructor(private readonly salaryService: SalaryService) {}

  @Post()
  create(@Body() createSalaryDto: CreateSalaryDto): Promise<SalaryInterface> {
    return this.salaryService.create(createSalaryDto);
  }
}
