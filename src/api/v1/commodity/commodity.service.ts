import {BadRequestException, forwardRef, Inject, Injectable} from '@nestjs/common';
import {CreateCommodityDto} from './dto/create-commodity.dto';
import {UpdateCommodityDto} from './dto/update-commodity.dto';
import {CommodityRepository} from "./commodity.repository";
import {OrderHistoryService} from "../histories/order-history/order-history.service";
import {Commodity} from "@prisma/client";
import {OrderService} from "../order/order.service";
import {SearchCommodityDto} from "./dto/search-commodity.dto";

@Injectable()
export class CommodityService {
  constructor(
    private readonly repository: CommodityRepository,
    private readonly orderHistoryService: OrderHistoryService,
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
  ) {
  }

  async create(body: CreateCommodityDto) {
    const commodity = await this.repository.create(body);
    await this.orderHistoryService.create({
      commodityId: commodity.id,
      price: commodity.price ?? commodity.price,
      amount: commodity.amount ?? commodity.amount,
      more: commodity.more ?? commodity.more,
      gift: commodity.gift ?? commodity.gift,
      confirmedAt: null
    });
    return commodity;
  }

  async findAll(search: SearchCommodityDto) {
    return await this.repository.findAll(search);
  }

  async findFirst(id: number) {
    return await this.repository.findFirst(id);
  }

  async findOne(id: number) {
    return await this.repository.findOne(id);
  }

  async update(id: number, updates: UpdateCommodityDto) {
    const commodity = await this.repository.findOne(id);
    if (updates?.orderId) {
      const order = await this.orderService.findOne(updates.orderId);
      if (order.deliveredAt) {
        throw new BadRequestException("Đơn hàng đã được giao thành công. Không được phép sửa!!!");
      }
    }
    if (updates?.logged) {
      this.orderHistoryService.create({
        commodityId: id,
        price: updates.price ?? commodity.price,
        amount: updates.amount ?? commodity.amount,
        more: updates.more ?? commodity.more,
        gift: updates.gift ?? commodity.gift,
        confirmedAt: updates.closed ? new Date() : null
      }).then();
    }

    await this.orderService.update(commodity.orderId, {});
console.log("update commodity", updates)
    return await this.repository.update(id, updates);
  }

  async remove(id: number) {
    const commodity = await this.repository.remove(id);
    this.orderService.update(commodity.orderId, {}).then();
    return commodity;
  }


  /**
   * Nếu có more thì giá trị trả về trong đơn hàng sẽ ở dạng này*/
  handleCommodity(commodity: Commodity) {
    const priceMore = Math.ceil((commodity.price * commodity.amount) / (commodity.amount + commodity.more));
    return Object.assign(commodity, commodity.more ? {
      more: {
        amount: commodity.more,
        price: priceMore,
      }
    } : null);
  }

  /*
  * Tổng trị giá đơn hàng
  * */
  totalCommodity(commodity: Commodity): number {
    if (commodity?.more) {
      return (commodity.amount * commodity.price) + (((commodity.amount + commodity.gift) / commodity.price) * commodity.more);
    } else {
      return commodity.amount * commodity.price;
    }
  }

  /*
  * Tổng tiền nhiều đơn hàng
  * */
  totalCommodities(commodities: Commodity[]) {
    return commodities.map(commodity => {
      return this.totalCommodity(commodity);
    }).reduce((a, b) => a + b, 0);
  }
}
