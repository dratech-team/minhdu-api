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

  async findOne(id: number) {
    return await this.repository.findOne(id);
  }

  async update(id: number, updates: UpdateCommodityDto) {
    const commodity = await this.findOne(id);

    this.orderHistoryService.create({
      orderId: commodity.orderId,
      price: updates.price,
      amount: updates.amount,
      more: updates.more,
      gift: updates.gift,
      confirmedAt: updates.closed ? new Date() : null
    }).then();
    return await this.repository.update(id, updates);
  }

  async remove(id: number) {
    return await this.repository.remove(id);
  }
}
