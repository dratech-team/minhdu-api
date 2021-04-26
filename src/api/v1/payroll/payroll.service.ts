import {Injectable} from "@nestjs/common";
import {PaginateModel} from "mongoose";
import {CreatePayrollDto} from "./dto/create-payroll.dto";
import {InjectModel} from "@nestjs/mongoose";
import {ModelName} from "../../../common/constant/database.constant";
import {PayrollDocument, PayrollEntity} from "./entities/payroll.entity";

@Injectable()
export class PayrollService {
  constructor(
    @InjectModel(ModelName.SALARY)
    private readonly salaryModel: PaginateModel<PayrollDocument>,
  ) {
  }

  // async create(body?: CreatePayrollDto): Promise<PayrollEntity> {
  //   return super.create(body);
  // }
}
