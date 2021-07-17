import {Injectable} from '@nestjs/common';
import {UpdateStatisticalDto} from './dto/update-statistical.dto';
import {StatisticalRepository} from "./statistical.repository";

@Injectable()
export class StatisticalService {
  constructor(private readonly repository: StatisticalRepository) {
  }

  async statisticalOrders(startedAt: Date, endedAt: Date) {
    return await this.repository.statisticalNation(startedAt, endedAt);
  }

  findOne(id: number) {
    return `This action returns a #${id} statistical`;
  }

  update(id: number, updateStatisticalDto: UpdateStatisticalDto) {
    return `This action updates a #${id} statistical`;
  }

  remove(id: number) {
    return `This action removes a #${id} statistical`;
  }
}
