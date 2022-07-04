import {Injectable} from '@nestjs/common';
import {CreateCommodityDto} from './dto/create-commodity.dto';
import {UpdateCommodityDto} from './dto/update-commodity.dto';
import {CommodityRepository} from "./commodity.repository";
import {OrderHistoryService} from "../histories/order-history/order-history.service";

@Injectable()
export class CommodityService {
  constructor(
    private readonly repository: CommodityRepository,
    private readonly orderHistoryService: OrderHistoryService,
  ) {
  }

  async create(body: CreateCommodityDto) {
    return this.repository.create(body);
  }

  async findAll(take: number, skip: number) {
    return await this.repository.findAll(take, skip);
  }

  async findFirst(id: number) {
    return await this.repository.findFirst(id);
  }

  async update(id: number, updates: UpdateCommodityDto) {
    const commodity = await this.repository.findOne(id);
    if (updates.logged) {
      this.orderHistoryService.create({
        commodityId: id,
        price: updates.price ?? commodity.price,
        amount: updates.amount ?? commodity.amount,
        more: updates.more ?? commodity.more,
        gift: updates.gift ?? commodity.gift,
        confirmedAt: updates.closed ? new Date() : null
      }).then();
    }

    return await this.repository.update(id, updates);
  }

  async remove(id: number) {
    return await this.repository.remove(id);
  }
}
