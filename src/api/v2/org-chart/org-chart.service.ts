import {BadRequestException, Injectable} from '@nestjs/common';
import {OrgChartRepository} from "./org-chart.repository";

@Injectable()
export class OrgChartService {
  constructor(private readonly repository: OrgChartRepository) {
  }

  async findAll() {
    return  await this.repository.findAll();
  }

  async findOne() {
    return 'development';
  }
}
