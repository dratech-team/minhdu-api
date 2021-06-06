import {Injectable} from '@nestjs/common';
import {Salary} from '@prisma/client';
import {CreateSalaryDto} from "./dto/create-salary.dto";
import {SalaryRepository} from "./salary.repository";
import {UpdateSalaryDto} from "./dto/update-salary.dto";

@Injectable()
export class SalaryService {
  constructor(private readonly repository: SalaryRepository) {
  }

  async create(body: CreateSalaryDto): Promise<Salary> {
    const salary = await this.repository.findMany(body);
    if (salary) {
      return salary;
    } else {
      return this.repository.create(body);
    }
  }

  //
  // findAll() {
  //   return `This action returns all salary`;
  // }
  //
  async findOne(id: number) {
    return this.repository.findOne(id);
  }


  async update(id: number, updateSalaryDto: UpdateSalaryDto) {
    return await this.repository.update(id, updateSalaryDto);
  }

  remove(id: number) {
    this.repository.remove(id).then();
  }
}
