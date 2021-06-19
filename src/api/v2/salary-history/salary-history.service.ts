import {Injectable} from '@nestjs/common';
import {CreateSalaryHistoryDto} from './dto/create-salary-history.dto';
import {UpdateSalaryHistoryDto} from './dto/update-salary-history.dto';
import {BaseSalaryHistoryService} from "./base-salary-history.service";
import {SalaryHistoryRepository} from "./salary-history.repository";

@Injectable()
export class SalaryHistoryService implements BaseSalaryHistoryService {
  constructor(private readonly repository: SalaryHistoryRepository) {
  }

  create(createSalaryHistoryDto: CreateSalaryHistoryDto) {
    return this.repository.create(createSalaryHistoryDto);
  }

  findAll(employeeId: number, search?: string) {
    return this.repository.findBy(employeeId, search);
  }

  findOne(id: number) {
    return this.repository.findOne(id);
  }

  update(id: number, updateSalaryHistoryDto: UpdateSalaryHistoryDto) {
    return this.repository.update(id, updateSalaryHistoryDto);
  }

  remove(id: number) {
    this.repository.remove(id);
  }
}
