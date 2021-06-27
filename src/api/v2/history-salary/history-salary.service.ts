import {Injectable} from '@nestjs/common';
import {HistorySalaryRepository} from "./history-salary.repository";

@Injectable()
export class HistorySalaryService {
  constructor(private readonly repository: HistorySalaryRepository) {
  }

  create(salaryId: number, employeeId: number) {
    return this.repository.create(salaryId, employeeId);
  }

  findAll() {
    return `This action returns all historySalary`;
  }

  findOne(id: number) {
    return `This action returns a #${id} historySalary`;
  }

  update() {
    return `This action updates a  historySalary`;
  }

  remove(id: number) {
    return `This action removes a #${id} historySalary`;
  }
}
