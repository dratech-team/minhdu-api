import { Injectable } from '@nestjs/common';
import { CreateSystemHistoryDto } from './dto/create-system-history.dto';
import { UpdateSystemHistoryDto } from './dto/update-system-history.dto';

@Injectable()
export class SystemHistoryService {
  create(createSystemHistoryDto: CreateSystemHistoryDto) {
    return 'This action adds a new systemHistory';
  }

  findAll() {
    return `This action returns all systemHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} systemHistory`;
  }

  update(id: number, updateSystemHistoryDto: UpdateSystemHistoryDto) {
    return `This action updates a #${id} systemHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} systemHistory`;
  }
}
