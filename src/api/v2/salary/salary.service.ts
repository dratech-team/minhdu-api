import {BadRequestException, Injectable} from '@nestjs/common';
import {Salary, SalaryType} from '@prisma/client';
import {CreateSalaryDto} from "./dto/create-salary.dto";
import {SalaryRepository} from "./salary.repository";
import {UpdateSalaryDto} from "./dto/update-salary.dto";

@Injectable()
export class SalaryService {
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

  //
  // findAll() {
  //   return `This action returns all salary`;
  // }
  //
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

  remove(id: number) {
    this.repository.remove(id).then();
  }
}
