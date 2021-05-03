import {Injectable} from '@nestjs/common';
import {CreatePayrollDto} from './dto/create-payroll.dto';
import {UpdatePayrollDto} from './dto/update-payroll.dto';
import {PrismaService} from "../../../prisma.service";

@Injectable()
export class PayrollService {
  constructor(private readonly prisma: PrismaService) {
  }

  create(body: CreatePayrollDto) {
    return 'This action adds a new payroll';
  }

  findAll() {
    return `This action returns all payroll`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payroll`;
  }

  update(id: number, updatePayrollDto: UpdatePayrollDto) {
    return `This action updates a #${id} payroll`;
  }

  remove(id: number) {
    return `This action removes a #${id} payroll`;
  }
}
