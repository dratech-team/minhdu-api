import {Injectable} from '@nestjs/common';
import {CreateCommodityDto} from './dto/create-commodity.dto';
import {UpdateCommodityDto} from './dto/update-commodity.dto';
import {CommodityRepository} from "./commodity.repository";
import {Commodity} from "@prisma/client";

@Injectable()
export class CommodityService {
  constructor(private readonly repository: CommodityRepository) {
  }

  async create(body: CreateCommodityDto) {
    return await this.repository.create(body);
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async findOne(id: number) {
    return await this.repository.findOne(id);
  }

  async update(id: number, updates: UpdateCommodityDto) {
    return await this.repository.update(id, updates);
  }

  async remove(id: number) {
    await this.repository.remove(id);
  }


  handleCommodity(commodity: Commodity) {
    const priceMore = Math.ceil((commodity.price * commodity.amount) / (commodity.amount + commodity.more));
    return {
      id: commodity.id,
      code: commodity.code,
      name: commodity.name,
      unit: commodity.unit,
      price: commodity.price,
      amount: commodity.amount,
      gift: commodity.gift,
      more: {
        commodityMore: commodity.more,
        price: priceMore,
      }
    };
  }

  /// TODO: Tính tổng tiền của đơn hàng này dựa vào list id đơn hàng được truyền từ bên order
  totalCommodity(ids: number[]) {
    /// TODO: get thoong tin sản hẩm dựa vào id;
    // return ids.map(id => this.findOne(id));

    /// FIXME: Dummy data
    return 0;
    // return commodities.map((commodity) => {
    //   return Math.ceil((commodity.price * commodity.amount) / (commodity.amount + commodity.more));
    // }).reduce((a, b) => a + b, 0);
  }
}
