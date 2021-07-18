import {Injectable} from '@nestjs/common';
import {UpdateStatisticalDto} from './dto/update-statistical.dto';
import {StatisticalRepository} from "./statistical.repository";
import {NationType} from "./enums/nation-type.enum";

@Injectable()
export class StatisticalService {
  constructor(private readonly repository: StatisticalRepository) {
  }

  async statisticalNation(startedAt: Date, endedAt: Date, type: NationType) {
    switch (type) {
      case NationType.ORDER:
        return await this.repository.statisticalOrder(startedAt, endedAt);
      case NationType.CUSTOMER:
        return await this.repository.statisticalCustomers();
    }
  }

  async statisticalCustomers() {
    return await this.repository.statisticalCustomers();
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
