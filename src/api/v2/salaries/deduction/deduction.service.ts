import {Injectable} from '@nestjs/common';
import {CreateDeductionDto} from './dto/create-deduction.dto';
import {UpdateDeductionDto} from './dto/update-deduction.dto';
import {DeductionRepository} from "./deduction.repository";
import {DeductionEntity} from "./entities/deduction.entity";
import {DeleteMultipleDeductionDto} from "./dto/delete-multiple-deduction.dto";
import {AbsentService} from "../absent/absent.service";
import {CreateAbsentDto} from "../absent/dto/create-absent.dto";
import {crudManyResponse} from "../base/functions/response.function";

@Injectable()
export class DeductionService {
  constructor(
    private readonly repository: DeductionRepository,
    private readonly absentService: AbsentService,
  ) {
  }

  async create(body: CreateDeductionDto | CreateAbsentDto) {
    if (!(body as CreateDeductionDto)?.settingId) {
      const salaries = body.payrollIds.map(payrollId => {
        return this.mapToDeduction(Object.assign(body, {payrollId}));
      }) as DeductionEntity[];

      const {count} = await this.repository.createMany(salaries);
      return crudManyResponse(count, "creation");
    } else {
      return this.absentService.createMany(body as CreateAbsentDto);
    }
  }

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: number) {
    return this.repository.findOne(id);
  }

  async updateMany(body: UpdateDeductionDto) {
    const {count} = await this.repository.updateMany(body.salaryIds, this.mapToDeduction(body));
    return crudManyResponse(count, "updation");
  }

  async removeMany(body: DeleteMultipleDeductionDto) {
    const {count} = await this.repository.removeMany(body);
    return crudManyResponse(count, "deletion");
  }

  private mapToDeduction(body): DeductionEntity {
    return {
      title: body.title,
      unit: body.unit,
      price: body.price,
      payrollId: body.payrollId,
      blockId: body.blockId,
      note: body.note,
    };
  }
}
