import { Body, Controller, Post } from "@nestjs/common";
import { BasicSalary } from "./schema/basic-salary.schema";
import { CreateBasicSalaryDto } from "./dto/create-basic-salary.dto";
import { BasicSalaryService } from "./basic-salary.service";

@Controller("v1/basic-salary")
export class BasicSalaryController {
  constructor(private readonly service: BasicSalaryService) {}

  @Post()
  create(@Body() body: CreateBasicSalaryDto): Promise<BasicSalary> {
    return this.service.create(body);
  }
}
