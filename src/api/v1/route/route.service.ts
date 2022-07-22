import {Injectable} from "@nestjs/common";
import {CreateRouteDto} from "./dto/create-route.dto";
import {UpdateRouteDto} from "./dto/update-route.dto";
import {RouteRepository} from "./route.repository";
import {Response} from "express";
import {exportExcel} from "../../../core/services/export.service";
import {SearchRouteDto} from "./dto/search-route.dto";
import {CancelRouteDto} from "./dto/cancel-route.dto";
import {OrderService} from "../order/order.service";
import * as _ from 'lodash';
import {isEqual} from 'lodash';
import {RouteEntity} from "./entities/route.entity";
import {CancelTypeEnum} from "./enums/cancel-type.enum";

@Injectable()
export class RouteService {
  constructor(
    private readonly repository: RouteRepository,
    private readonly orderService: OrderService,
  ) {
  }

  async create(body: CreateRouteDto) {
    const route = await this.repository.create(body);
    return this.mapToRoute(route);
  }

  async findAll(search: SearchRouteDto) {
    const {total, data} = await this.repository.findAll(search);
    return {total, data: data.map(route => this.mapToRoute(route))};
  }

  async findOne(id: number) {
    const route = await this.repository.findOne(id);
    return this.mapToRoute(route);
  }

  async update(id: number, updates: UpdateRouteDto) {
    const route = await this.repository.update(id, updates);
    return this.mapToRoute(route);
  }

  async remove(id: number) {
    return await this.repository.remove(id);
  }

  async cancel(id: number, body: CancelRouteDto) {
    const route = await this.repository.cancel(id, body);
    if (body.desId && body.cancelType === "ORDER") {
      const order = await this.orderService.findOne(body.desId);
      if (order) {
        const commodityIds = order.commodities.map(commodity => commodity.id);
        commodityIds?.length && await Promise.all(commodityIds.map(async commodityId => {
          return await this.repository.cancel(id, {cancelType: CancelTypeEnum.COMMODITY, desId: commodityId});
        }));
      }
    } else {
      for (let i = 0; i < route.orders.length; i++) {
        const order = route.orders[i];
        if (!isEqual(order.commodities?.map(commodity => commodity.id), route.commodities.map(commodity => commodity.id))) {
          await this.repository.cancel(id, {cancelType: CancelTypeEnum.ORDER, desId: order.id});
        }
      }
    }

    return route;
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

  /*
  * commodityUniq những commodity thuộc tuyến xe hiện tại.
  * */
  private mapToRoute(route: RouteEntity) {
    return Object.assign(route, {
      commodityUniq: this.orderService.commodityUniq(_.flattenDeep(route.orders.map(order => order.commodities.filter(commodity => commodity.routeId)))),
    });
  }
}
