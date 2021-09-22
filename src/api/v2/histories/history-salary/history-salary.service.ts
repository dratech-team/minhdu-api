import {BadRequestException, Injectable} from '@nestjs/common';
import {HistorySalaryRepository} from "./history-salary.repository";

@Injectable()
export class HistorySalaryService {
    constructor(private readonly repository: HistorySalaryRepository) {
    }

    async create(salaryId: number, employeeId: number) {
        try {
            return await this.repository.create(salaryId, employeeId);
        } catch (err) {
            console.error("history salary err", err);
            throw new BadRequestException(err);
        }
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
