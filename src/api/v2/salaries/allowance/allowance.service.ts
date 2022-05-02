import {Injectable} from '@nestjs/common';
import {UpdateAllowanceDto} from './dto/update-allowance.dto';
import {AllowanceRepository} from "./allowance.repository";
import {RemoveManyAllowanceDto} from "./dto/remove-many-allowance.dto";
import {CreateManyAllowanceDto} from "./dto/create-many-allowance.dto";
import {CreateAllowanceDto} from "./dto/create-allowance.dto";
import {crudManyResponse} from "../base/functions/response.function";

@Injectable()
export class AllowanceService {
  constructor(private readonly repository: AllowanceRepository) {
  }

  async createMany(body: CreateManyAllowanceDto) {
    const salaries = body.payrollIds.map(payrollId => this.mapToAllowance(Object.assign(body, {payrollId})));
    const {count} = await this.repository.createMany(salaries);
    return crudManyResponse(count, "creation");
  }

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: number) {
    return this.repository.findOne(id);
  }

  async updateMany(body: UpdateAllowanceDto) {
    const {count} = await this.repository.updateMany(body.salaryIds, this.mapToAllowance(body));
    return crudManyResponse(count, "updation");
  }

  async removeMany(body: RemoveManyAllowanceDto) {
    const {count} = await this.repository.remove(body);
    return crudManyResponse(count, "deletion");
  }

  private mapToAllowance(body): CreateAllowanceDto {
    return {
      title: body.title,
      price: body.price,
      payrollId: body.payrollId,
      branchId: body?.branchId,
      rate: body.rate,
      isWorkday: body.isWorkday,
      inOffice: body.inOffice,
      startedAt: body.startedAt,
      endedAt: body.endedAt,
    };
  }
}
