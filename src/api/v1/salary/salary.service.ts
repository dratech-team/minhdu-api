import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Model } from "mongoose";
import { CreateSalaryDto } from "./dto/create-salary.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Salary, SalaryDocument } from "./schema/salary.schema";
import { ModelName } from "../../../common/constant/database.constant";

@Injectable()
export class SalaryService {
  constructor(
    @InjectModel(ModelName.SALARY)
    private readonly salaryModel: Model<SalaryDocument>
  ) {}

  async create(createSalaryDto: CreateSalaryDto): Promise<Salary> {
    const createdSalary = new this.salaryModel(createSalaryDto);
    try {
      await createdSalary.save();
    } catch (err) {
      throw new InternalServerErrorException();
    }
    return createdSalary;
  }
}
