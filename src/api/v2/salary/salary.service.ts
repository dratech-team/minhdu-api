import {Injectable} from '@nestjs/common';
import {Salary} from '@prisma/client';
import {CreateSalaryDto} from "./dto/create-salary.dto";
import {SalaryRepository} from "./salary.repository";

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

  //
  // async update(id: number, updateSalaryDto: UpdateSalaryDto) {
  //   return this.prisma.salary.update({
  //     where: {id: id},
  //     data: updateSalaryDto
  //   });
  // }
  //
  remove(id: number) {
    this.repository.remove(id).then();
  }
}
