import {Injectable} from '@nestjs/common';
import {UpdateAllowanceDto} from './dto/update-allowance.dto';
import {AllowanceRepository} from "./allowance.repository";
import {RemoveManyAllowanceDto} from "./dto/remove-many-allowance.dto";
import {CreateManyAllowanceDto} from "./dto/create-many-allowance.dto";
import {CreateAllowanceDto} from "./dto/create-allowance.dto";

@Injectable()
export class AllowanceService {
  constructor(private readonly repository: AllowanceRepository) {
  }

  createMany(body: CreateManyAllowanceDto) {
    const salaries = body.payrollIds.map(payrollId => this.mapToAllowance(Object.assign(body, {payrollId})));
    return this.repository.createMany(salaries);
  }

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: number) {
    return this.repository.findOne(id);
  }

  updateMany(body: UpdateAllowanceDto) {
    return this.repository.updateMany(body.salaryIds, this.mapToAllowance(body));
  }

  removeMany(body: RemoveManyAllowanceDto) {
    return this.repository.remove(body);
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
      ended: body.endedAt,
    };
  }
}
