import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateSalaryBlockDto} from './dto/create-salary-block.dto';
import {UpdateSalaryBlockDto} from './dto/update-salary-block.dto';
import {PrismaService} from "../../../../prisma.service";

@Injectable()
export class SalaryBlockService {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateSalaryBlockDto) {
    try {
      return 'This action adds a new salaryBlock';
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll() {
    try {
      const blocks = await this.prisma.salaryBlock.findMany();
      return blocks.map(block => Object.assign(block, {
        constraintHoliday: {
          disabled: false,
          show: true
        },
        insurance: {
          show: true,
          disabled: false
        },
        rate: {
          disabled: false,
          show: true
        },
        price: {
          disabled: false,
          show: true
        }
      }));
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findOne(id: number) {
    try {
      return `This action returns a #${id} salaryBlock`;
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async update(id: number, body: UpdateSalaryBlockDto) {
    try {
      return `This action updates a #${id} salaryBlock`;
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async remove(id: number) {
    try {
      return `This action removes a #${id} salaryBlock`;
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
