import {BadRequestException, Injectable} from "@nestjs/common";
import {CreateRouteDto} from "./dto/create-route.dto";
import {UpdateRouteDto} from "./dto/update-route.dto";
import {RouteRepository} from "./route.repository";
import {Response} from "express";
import {exportExcel} from "../../../core/services/export.service";
import {SearchRouteDto} from "./dto/search-route.dto";

@Injectable()
export class RouteService {
  constructor(
    private readonly repository: RouteRepository,
  ) {
  }

  async create(body: CreateRouteDto) {
    return await this.repository.create(body);
  }

  async findAll(
    skip: number,
    take: number,
    search: Partial<SearchRouteDto>
  ) {
    return await this.repository.findAll(skip, take, search);
  }

  async findOne(id: number) {
    return await this.repository.findOne(id);
  }

  async update(id: number, updates: UpdateRouteDto) {
    const found = await this.findOne(id);
    if (found.endedAt) {
      throw new BadRequestException("Chuyến xe này đã kết thúc. Bạn không có được phép sửa..");
    }
    return await this.repository.update(id, updates);
  }

  async remove(id: number) {
    return await this.repository.remove(id);
  }

  async export(response?: Response, search?: Partial<CreateRouteDto>) {
    const data = await this.repository.findAll(undefined, undefined, search);
    return await exportExcel(
      response,
      {
        title: "Danh sách tuyến đường XXXX",
        customHeaders: [
          "Tên tuyến đường",
          "Ngày khởi hành",
          "Ngày kết thúc",
          "Nhà xe",
          "Tên tài xế",
          "Biển số xe",
        ],
        customKeys: ["name", "startedAt", "endedAt", "garage", "driver", "bsx"],
        name: "Danh sách tuyến đường",
        data: data.data.map((e) => ({
          name: e.name,
          startedAt: e.startedAt,
          endedAt: e.endedAt,
          garage: e.garage,
          driver: e.driver,
          bsx: e.bsx,
        })),
      },
      200
    );
  }
}
