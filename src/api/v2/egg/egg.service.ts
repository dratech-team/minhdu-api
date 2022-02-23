import {Injectable} from '@nestjs/common';
import {CreateEggDto} from './dto/create-egg.dto';
import {UpdateEggDto} from './dto/update-egg.dto';
import {SearchEggDto} from "./dto/search-egg.dto";
import {EggRepository} from "./egg.repository";
import {EggType} from '@prisma/client';
import * as moment from "moment";

@Injectable()
export class EggService {
  constructor(private readonly repository: EggRepository) {
  }

  async create(body: CreateEggDto) {
    return await this.repository.create(body);
  }

  async findAll(search: SearchEggDto) {
    const paginate = await this.repository.findAll(search);

    const total = [EggType.TRONG, EggType.TAN, EggType.NUT, EggType.THOI, EggType.PHOI_SONG].map(type => {
      return paginate.data.find(egg => egg.type === type)?.amount || 0;
    }).reduce((a, b) => a + b, 0);


    const total2 = [EggType.TRONG, EggType.TAN, EggType.NUT, EggType.THOI].map(type => {
      return paginate.data.find(egg => egg.type === type)?.amount || 0;
    }).reduce((a, b) => a + b, 0);

    const eggs = [EggType.TRONG, EggType.TAN, EggType.NUT, EggType.THOI, EggType.PHOI_SONG].map(type => {
      const amountEgg = paginate.data.find(egg => egg.type === type)?.amount || 0;
      return {
        type: type,
        amount: amountEgg,
        rate: (amountEgg / total) * 100,
      };
    }).concat({type: 'SOI_LOAI' as any, amount: total2, rate: (total2 / total) * 100});

    return {
      total: paginate.total,
      data: {
        createdAt: search.startedAt,
        endedAt: moment(search.startedAt).subtract(21, "days").toDate(),
        totalEgg: total,
        eggs: eggs,
      }
    };
  }

  async findOne(id: number) {
    return await this.repository.findOne(id);
  }

  async update(id: number, updates: UpdateEggDto) {
    return await this.repository.update(id, updates);
  }

  async remove(id: number) {
    return await this.repository.remove(id);
  }
}
