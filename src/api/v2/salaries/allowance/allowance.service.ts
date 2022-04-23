import { Injectable } from '@nestjs/common';
import { CreateAllowanceDto } from './dto/create-allowance.dto';
import { UpdateAllowanceDto } from './dto/update-allowance.dto';

@Injectable()
export class AllowanceService {
  create(createAllowanceDto: CreateAllowanceDto) {
    return 'This action adds a new allowance';
  }

  findAll() {
    return `This action returns all allowance`;
  }

  findOne(id: number) {
    return `This action returns a #${id} allowance`;
  }

  update(id: number, updateAllowanceDto: UpdateAllowanceDto) {
    return `This action updates a #${id} allowance`;
  }

  remove(id: number) {
    return `This action removes a #${id} allowance`;
  }
}
