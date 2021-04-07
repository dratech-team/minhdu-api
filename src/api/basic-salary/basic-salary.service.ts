import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ModelName } from "@/constants/database.constant";
import { Model } from "mongoose";
import { BasicSalary, BasicSalaryDocument } from "./schema/basic-salary.schema";
import { BaseRepositoryService } from "@/crud-base/base-repository.service";

@Injectable()
export class BasicSalaryService extends BaseRepositoryService<BasicSalaryDocument> {
  constructor(
    @InjectModel(ModelName.BASIC_SALARY)
    private basicSalaryModel: Model<BasicSalaryDocument>
  ) {
    super(basicSalaryModel);
  }

  create(payload: any, ...args): Promise<any> {
    console.log(payload);
    console.log(args);
    return super.create(payload, ...args);
  }
}
