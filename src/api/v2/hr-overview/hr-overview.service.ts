import {Injectable} from '@nestjs/common';
import {CreateHrOverviewDto} from './dto/create-hr-overview.dto';
import {UpdateHrOverviewDto} from './dto/update-hr-overview.dto';
import {HrOverviewRepository} from "./hr-overview.repository";
import {HrOverviewFilterEnum} from "./entities/hr-overview-filter.enum";

@Injectable()
export class HrOverviewService {
  constructor(private readonly repository: HrOverviewRepository) {
  }

  async create(body: CreateHrOverviewDto) {
    return 'This action adds a new hrOverview';
  }

  async findAll(filter: HrOverviewFilterEnum, isLeft: boolean) {
    return await this.repository.findAll(filter, isLeft);
  }

  findOne(id: number) {
    return `This action returns a #${id} hrOverview`;
  }

  update(id: number, updates: UpdateHrOverviewDto) {
    return `This action updates a #${id} hrOverview`;
  }

  remove(id: number) {
    return `This action removes a #${id} hrOverview`;
  }
}
