import {BadRequestException, Injectable} from '@nestjs/common';
import {Salary} from '@prisma/client';
import {CreateSalaryDto} from "./dto/create-salary.dto";
import {SalaryRepository} from "./salary.repository";
import {UpdateSalaryDto} from "./dto/update-salary.dto";
import {BaseSalaryService} from "./base-salary.service";

@Injectable()
export class SalaryService implements BaseSalaryService {
  constructor(private readonly repository: SalaryRepository) {
  }

  async create(body: CreateSalaryDto): Promise<Salary> {
    try {
      return await this.repository.create(body);
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }


  findAll(employeeId: number, skip: number, take: number, search?: string) {
    return this.repository.findAll(employeeId, skip, take, search);
  }

  findBy(employeeId: number, query: any): Promise<Salary[]> {
    throw new Error('Method not implemented.');
  }

  async findOne(id: number) {
    return this.repository.findOne(id);
  }


  async update(id: number, updateSalaryDto: UpdateSalaryDto) {
    try {
      return await this.repository.update(id, updateSalaryDto);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async remove(id: number) {
   await this.repository.remove(id);
  }

  createHistory(): Promise<void> {
    return Promise.resolve(undefined);
  }
}
