import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateCommodityDto} from './dto/create-commodity.dto';
import {UpdateCommodityDto} from './dto/update-commodity.dto';
import {CommodityRepository} from "./commodity.repository";
import {Commodity} from "@prisma/client";

@Injectable()
export class CommodityService {
  constructor(private readonly repository: CommodityRepository) {
  }

  async create(body: CreateCommodityDto) {
    const created = await this.repository.create(body);
    return this.handleCommodity(created);
  }

  async findAll(take: number, skip: number) {
    const found = await this.repository.findAll(take, skip);
    return {
      total: found.total,
      data: found.data.map(commodity => this.handleCommodity(commodity))
    };
  }

  async findOne(id: number) {
    const found = await this.repository.findOne(id);
    if (!found) {
      throw new BadRequestException(`Not found id ${id} or linked`);
    }
    return this.handleCommodity(found);
  }

  async update(id: number, updates: UpdateCommodityDto) {
    return await this.repository.update(id, updates);
  }

  async remove(id: number) {
    await this.repository.remove(id);
  }


  /**
   * Nếu có more thì giá trị trả về trong đơn hàng sẽ ở dạng này*/
  handleCommodity(commodity: Commodity) {
    const priceMore = Math.ceil((commodity.price * commodity.amount) / (commodity.amount + commodity.more));
    return Object.assign(commodity, {
      more: {
        amount: commodity.more,
        price: priceMore,
      }
    });
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
  totalCommodities(commodities: any[]) {
    return commodities.map(commodity => {
      return this.totalCommodity(commodity);
    }).reduce((a, b) => a + b, 0);
  }
}
