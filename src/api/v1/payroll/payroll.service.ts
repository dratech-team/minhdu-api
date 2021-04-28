import {Injectable, NotFoundException} from "@nestjs/common";
import {PaginateModel, PaginateResult} from "mongoose";
import {CreatePayrollDto} from "./dto/create-payroll.dto";
import {InjectModel} from "@nestjs/mongoose";
import {ModelName} from "../../../common/constant/database.constant";
import {PayrollDocument, PayrollEntity} from "./entities/payroll.entity";
import {ObjectId} from "mongodb";

@Injectable()
export class PayrollService {
  constructor(
    @InjectModel(ModelName.PAYROLL)
    private readonly model: PaginateModel<PayrollDocument>,
  ) {
  }

  async create(body: CreatePayrollDto): Promise<PayrollEntity> {
    return this.model.create(body);
  }

  async findOne(employeeId: ObjectId, id: ObjectId): Promise<PayrollEntity> {
    return this.model.findOne({
      employeeId: employeeId,
      _id: id
    }).orFail(new NotFoundException(`payroll not found: ${id}`)).populate("employeeId");
  }

  async findAll(employeeId: ObjectId): Promise<PaginateResult<PayrollEntity>> {
    return await this.model.paginate({employeeId: employeeId});
  }
}
