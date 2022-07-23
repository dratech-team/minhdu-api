import {BadRequestException, Injectable} from "@nestjs/common";
import {CreateRouteDto} from "./dto/create-route.dto";
import {UpdateRouteDto} from "./dto/update-route.dto";
import {RouteRepository} from "./route.repository";
import {Response} from "express";
import {exportExcel} from "../../../core/services/export.service";
import {SearchRouteDto} from "./dto/search-route.dto";
import {CancelRouteDto} from "./dto/cancel-route.dto";
import {OrderService} from "../order/order.service";
import {RouteEntity} from "./entities/route.entity";
import {CancelTypeEnum} from "./enums/cancel-type.enum";
import {CommodityService} from "../commodity/commodity.service";
import {uniq} from "lodash";

@Injectable()
export class RouteService {
  constructor(
    private readonly repository: RouteRepository,
    private readonly orderService: OrderService,
    private readonly commodityService: CommodityService,
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
    const found = await this.findOne(id);
    if (found.endedAt) {
      throw new BadRequestException("Chuyến xe đã hoàn thành. không được phép sửa.");
    }
    if (updates?.endedAt) {
      for (let i = 0; i < found.commodities.length; i++) {
        const commodity = found.commodities[i];
        if(!commodity.deliveredAt) {
          await this.commodityService.update(commodity.id, {deliveredAt: updates.endedAt});
        }
      }

      const orderIds = uniq(found.commodities?.map((commodity) => commodity.orderId));
      for (let i = 0; i < orderIds.length; i++) {
        const orderId = orderIds[i];
        const order = await this.orderService.findOne(orderId);
        if (order && order.commodities.every(commodity => commodity.deliveredAt !== null)) {
          await this.orderService.update(orderId, {deliveredAt: updates?.endedAt});
        }
      }
    }
    const route = await this.repository.update(id, updates);
    return this.mapToRoute(route);
  }

  async remove(id: number) {
    return await this.repository.remove(id);
  }

  async restore(id: number) {
    const route = await this.repository.update(id, {endedAt: null});
    return this.mapToRoute(route);
  }


  async cancel(id: number, body: CancelRouteDto) {
    const route = await this.repository.cancel(id, body);

    if (body.desId && body.cancelType === "ORDER") {
      const order = await this.orderService.findOne(body.desId);
      if (order.deliveredAt !== null) {
        throw new BadRequestException("Đơn hàng đã được giao thành công. Không được phép huỷ");
      }
      if (order.commodities.length) {
        const commodityIds = order.commodities.map(commodity => commodity.id);
        await Promise.all(commodityIds.map(async commodityId => {
          return await this.repository.cancel(id, {cancelType: CancelTypeEnum.COMMODITY, desId: commodityId});
        }));
      }
    } else {
      const commodity = await this.commodityService.findOne(body.desId);
      if (commodity.deliveredAt !== null) {
        throw new BadRequestException("Mặt hàng đã được giao thành công. Không được phép huỷ");
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
      commodityUniq: this.orderService.commodityUniq(route.commodities),
    });
  }
}
