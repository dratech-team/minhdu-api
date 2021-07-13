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
    if (commodity.more != 0) {
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
    } else {
      return commodity;
    }
  }
}
