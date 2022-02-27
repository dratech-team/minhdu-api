import {Injectable} from "@nestjs/common";
import {CreateRouteDto} from "./dto/create-route.dto";
import {UpdateRouteDto} from "./dto/update-route.dto";
import {RouteRepository} from "./route.repository";
import {Response} from "express";
import {exportExcel} from "../../../core/services/export.service";
import {SearchRouteDto} from "./dto/search-route.dto";
import {OrderService} from "../order/order.service";

@Injectable()
export class RouteService {
  constructor(
    private readonly repository: RouteRepository,
    private readonly orderService: OrderService,
  ) {
  }

  async create(body: CreateRouteDto) {
    return await this.repository.create(body);
  }

  async findAll(search: SearchRouteDto) {
    return await this.repository.findAll(search);
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

  async export(response?: Response, search?: SearchRouteDto) {
    const data = await this.repository.findAll(search);
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
