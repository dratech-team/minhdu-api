import {Injectable,} from '@nestjs/common';
import {CreateRouteDto} from './dto/create-route.dto';
import {UpdateRouteDto} from './dto/update-route.dto';
import {RouteRepository} from "./route.repository";
import {ExportService} from "../../../core/services/export.service";
import {Response} from 'express';

@Injectable()
export class RouteService {
  constructor(private readonly repository: RouteRepository, private readonly exportService: ExportService) {
  }

  async create(body: CreateRouteDto) {
    return await this.repository.create(body);
  }

  async findAll(
    skip: number,
    take: number,
    name: string,
    startedAt: Date,
    endedAt: Date,
    driver: string,
    bsx: string,
  ) {
    if (startedAt) {
      startedAt = new Date(startedAt);
    }

    if (endedAt) {
      endedAt = new Date(endedAt);
    }

    return await this.repository.findAll(skip, take, {name, startedAt, endedAt, driver, bsx});
  }

  async findOne(id: number) {
    return await this.repository.findOne(id);
  }

  async update(id: number, updates: UpdateRouteDto) {
    return await this.repository.update(id, updates);
  }

  async remove(id: number) {
    return await this.repository.remove(id);
  }

  async export(response?: Response, search?: Partial<CreateRouteDto>) {
    const data = await this.repository.finds(search);
    const res = this.exportService.toExcel(response, {
      excel: {
        title: search?.startedAt && search?.endedAt  ?
          'Danh sách tuyến đường từ ngày '+ search?.startedAt+ ' đến ngày '+ search?.endedAt:
            search?.startedAt ?  'Danh sách tuyến đường từ ngày '+ search?.startedAt + ' đến ngày '+ new Date() : 'Danh sách Tuyến đương',
        name: "data.xlsx",
        data: data.map(e => ({
          name: e.name,
          startedAt: e.startedAt,
          endedAt: e.endedAt,
          garage: e.garage,
          driver: e.driver,
          bsx: e.bsx
        })),
        customHeaders: ["Tên tuyến đường", "Ngày khởi hành", "Ngày kết thúc", "Nhà xe", "Tên tài xế", "Biển số xe"]
      }
    }, 200);

  }
}
