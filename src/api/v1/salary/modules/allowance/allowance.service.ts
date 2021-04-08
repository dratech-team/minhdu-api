import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ModelName } from "@/constants/database.constant";
import { Model } from "mongoose";
import { AllowanceSalaryDocument } from "./schema/allowance-salary.schema";
import { BaseService } from "@/crud-base/base.service";

@Injectable()
export class AllowanceService extends BaseService<AllowanceSalaryDocument> {
  constructor(
    @InjectModel(ModelName.ALLOWANCE_SALARY)
    private readonly allowanceModel: Model<AllowanceSalaryDocument>
  ) {
    super(allowanceModel);
  }
}
