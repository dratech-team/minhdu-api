import { Injectable } from '@nestjs/common';
import { CreateConsignmentDto } from './dto/create-consignment.dto';
import { UpdateConsignmentDto } from './dto/update-consignment.dto';

@Injectable()
export class ConsignmentService {
  create(createConsignmentDto: CreateConsignmentDto) {
    return 'This action adds a new consignment';
  }

  findAll() {
    return `This action returns all consignment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} consignment`;
  }

  update(id: number, updateConsignmentDto: UpdateConsignmentDto) {
    return `This action updates a #${id} consignment`;
  }

  remove(id: number) {
    return `This action removes a #${id} consignment`;
  }
}
