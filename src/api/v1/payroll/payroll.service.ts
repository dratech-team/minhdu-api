import {Injectable} from "@nestjs/common";
import {Model, PaginateModel} from "mongoose";
import {CreatePayrollDto} from "./dto/create-payroll.dto";
import {InjectModel} from "@nestjs/mongoose";
import {ModelName} from "../../../common/constant/database.constant";
import {BaseService} from "../../../core/crud-base/base.service";
import {PayrollDocument, PayrollEntity} from "./entities/payroll.entity";

@Injectable()
export class PayrollService extends BaseService<PayrollDocument> {
  constructor(
    @InjectModel(ModelName.SALARY)
    private readonly salaryModel: PaginateModel<PayrollDocument>,
  ) {
    super(salaryModel);
  }

  async create(body?: CreatePayrollDto): Promise<PayrollEntity> {
    return super.create(body);
  }
}
