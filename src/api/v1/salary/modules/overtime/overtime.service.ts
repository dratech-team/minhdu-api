import { Injectable } from "@nestjs/common";
import { BaseService } from "../../../../../core/crud-base/base.service";
import {
  OvertimeSalaryEntity,
  OvertimeSalaryDocument,
} from "./entities/overtime-salary.schema";
import { InjectModel } from "@nestjs/mongoose";
import { ModelName } from "../../../../../common/constant/database.constant";
import { Model, Types } from "mongoose";
import { CreateOvertimeSalaryDto } from "./dto/create-overtime-salary.dto";
import { PaginatorOptions } from "../../../../../core/crud-base/interface/pagination.interface";
import { CorePaginateResult } from "../../../../../core/interfaces/pagination";
import { UpdateOvertimeSalaryDto } from "./dto/update-overtime-salary.dto";
import { OvertimeType } from "./overtime-type.enum";
import { BasicSalaryService } from "../basic/basic-salary.service";

@Injectable()
export class OvertimeService extends BaseService<OvertimeSalaryDocument> {
  constructor(
    @InjectModel(ModelName.OVERTIME_SALARY)
    private readonly overtimeModel: Model<OvertimeSalaryDocument>,
    private readonly basicSalaryService: BasicSalaryService
  ) {
    super(overtimeModel);
  }

  async create(
    body: CreateOvertimeSalaryDto,
    ...args
  ): Promise<OvertimeSalaryEntity> {
    return super.create(body, ...args);
  }

  async findOne(id: Types.ObjectId, ...args): Promise<OvertimeSalaryEntity> {
    return super.findOne(id, ...args);
  }

  async findAll(
    paginateOpts?: PaginatorOptions,
    ...args
  ): Promise<CorePaginateResult<OvertimeSalaryEntity>> {
    return super.findAll(paginateOpts, ...args);
  }

  async update(
    id: Types.ObjectId,
    updates: UpdateOvertimeSalaryDto,
    ...args
  ): Promise<OvertimeSalaryEntity> {
    return super.update(id, updates, ...args);
  }

  async remove(id: Types.ObjectId, ...args): Promise<void> {
    return await super.remove(id, ...args);
  }

  //TODO: 26 là số ngày làm chuẩn. Hiện tại đang hardcode. Sau khi làm xong user sẽ thay lấy ngày làm chuẩn từ db
  async overtimeSalaryTotal(): Promise<number> {
    const salaries = await this.findAll();
    let amount: number = 0;
    let basicSalary: number = await this.basicSalaryService.basicSalaryTotal();

    for (let i = 0; i < salaries.data.length; i++) {
      if (salaries.data[i].type == OvertimeType.HOUR) {
        amount = salaries.data[i].price * salaries.data[i].times;
      } else if (salaries.data[i].type == OvertimeType.DAY) {
        amount =
          amount +
          (basicSalary / 26) * salaries.data[i].times * salaries.data[i].rate;
      }
    }
    return amount;
  }
}
