import {Injectable} from '@nestjs/common';
import {CreateDeductionDto} from './dto/create-deduction.dto';
import {UpdateDeductionDto} from './dto/update-deduction.dto';
import {DeductionRepository} from "./deduction.repository";
import {DeductionSalary} from '@prisma/client';

@Injectable()
export class DeductionService {
  constructor(private readonly repository: DeductionRepository) {
  }

  create(body: CreateDeductionDto) {
    return this.repository.create(this.mapToDeduction(body));
  }

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: number) {
    return this.repository.findOne(id);
  }

  update(id: number, body: UpdateDeductionDto) {
    return this.repository.update(id, body);
  }

  remove(id: number) {
    return this.repository.remove(id);
  }

  private mapToDeduction(body: CreateDeductionDto): Omit<DeductionSalary, "id"> {
    return {
      title: body.title,
      unit: body.unit,
      price: body.price,
      payrollId: body.payrollId,
      note: body.note,
    };
  }
}
