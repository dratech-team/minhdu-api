import {Injectable} from '@nestjs/common';
import {
  CreateDeductionDto,
  CreateManyDeductionDto,
  RemoveManyDeductionDto,
  UpdateDeductionDto,
  UpdateManyDeductionDto
} from './dto';
import {DeductionRepository} from "./deduction.repository";
import {AbsentService} from "../absent/absent.service";
import {crudManyResponse} from "../base/functions/response.function";
import {CreateManyAbsentDto} from "../absent/dto/create-many-absent.dto";

@Injectable()
export class DeductionService {
  constructor(
    private readonly repository: DeductionRepository,
    private readonly absentService: AbsentService,
  ) {
  }

  async create(body: CreateManyDeductionDto) {
    const salaries = body.payrollIds.map(payrollId => {
      return this.mapToDeduction(Object.assign(body, {payrollId}));
    }) as CreateDeductionDto[];

    const {count} = await this.repository.createMany(salaries);
    return crudManyResponse(count, "creation");
  }

  findAll() {
    return this.repository.findAll();
  }

  async count() {
    return await this.repository.count();
  }

  findOne(id: number) {
    return this.repository.findOne(id);
  }

  async updateMany(body: UpdateManyDeductionDto) {
    const {count} = await this.repository.updateMany(body.salaryIds, this.mapToDeduction(body));
    return crudManyResponse(count, "updation");
  }

  async removeMany(body: RemoveManyDeductionDto) {
    const {count} = await this.repository.removeMany(body);
    return crudManyResponse(count, "deletion");
  }

  private mapToDeduction(body): CreateDeductionDto {
    return {
      title: body.title,
      price: body.price,
      payrollId: body.payrollId,
      blockId: body?.blockId || 7,
      note: body.note,
    } as CreateDeductionDto;
  }
}
