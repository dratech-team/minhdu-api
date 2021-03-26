import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { ModelName } from "@/constants/database.constant";
import { Model } from "mongoose";
import { SalaryInterface } from "./interfaces/salary.interface";
import { CreateSalaryDto } from "./dto/create-salary.dto";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class SalaryService {
  constructor(
    @InjectModel(ModelName.SALARY)
    private readonly salaryModel: Model<SalaryInterface>
  ) {}

  async create(createSalaryDto: CreateSalaryDto): Promise<SalaryInterface> {
    const createdSalary = new this.salaryModel(createSalaryDto);
    try {
      await createdSalary.save();
    } catch (err) {
      throw new InternalServerErrorException();
    }
    return createdSalary;
  }
}
