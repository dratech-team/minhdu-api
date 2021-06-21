import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateBankDto} from './dto/create-bank.dto';
import {UpdateBankDto} from './dto/update-bank.dto';
import {PrismaService} from "../../../prisma.service";

@Injectable()
export class BankService {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateBankDto) {
    try {
      return await this.prisma.bank.create({data: body});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  findAll() {
    return `This action returns all bank`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bank`;
  }

  update(id: number, updateBankDto: UpdateBankDto) {
    return `This action updates a #${id} bank`;
  }

  remove(id: number) {
    return `This action removes a #${id} bank`;
  }
}
