import {Injectable} from '@nestjs/common';
import {CreateEggDto} from './dto/create-egg.dto';
import {UpdateEggDto} from './dto/update-egg.dto';
import {SearchEggDto} from "./dto/search-egg.dto";
import {EggRepository} from "./egg.repository";
import {EggType} from '@prisma/client';
import * as moment from "moment";
import {EggTypeService} from "../egg-type/egg-type.service";

@Injectable()
export class EggService {
  constructor(
    private readonly repository: EggRepository,
    private readonly eggTypeService: EggTypeService
  ) {
  }

  async create(body: CreateEggDto) {
    return await this.repository.create(body);
  }

  async findAll(search: SearchEggDto) {
    const paginate = await this.repository.findAll(search);
    const eggTypes = await this.eggTypeService.findAll();

    const total = eggTypes.map(type => {
      return paginate.data.find(egg => egg.eggTypeId === type.id)?.amount || 0;
    }).reduce((a, b) => a + b, 0);


    const total2 = eggTypes.map(type => {
      return paginate.data.find(egg => egg.eggTypeId === type.id)?.amount || 0;
    }).reduce((a, b) => a + b, 0);

    const eggs = eggTypes.map(type => {
      const amountEgg = paginate.data.find(egg => egg.eggTypeId === type.id)?.amount || 0;
      return {
        type: type.name,
        amount: amountEgg,
        rate: (amountEgg / total) * 100,
      };
    }).concat({type: 'SOI_LOAI' as any, amount: total2, rate: (total2 / total) * 100});

    return {
      total: paginate.total,
      data: paginate.data.map(e => {
        return {
          createdAt: e.createdAt,
          endedAt: moment(e.createdAt).subtract(21, "days").toDate(),
          totalEgg: total,
          eggs: eggs,
        };
      })
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
