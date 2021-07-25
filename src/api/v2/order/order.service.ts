import {Injectable} from "@nestjs/common";
import {CreateOrderDto} from "./dto/create-order.dto";
import {UpdateOrderDto} from "./dto/update-order.dto";
import {OrderRepository} from "./order.repository";
import {CommodityService} from "../commodity/commodity.service";
import {PaidEnum} from "./enums/paid.enum";
import {PaymentType} from "@prisma/client";
import {searchName} from "../../../utils/search-name.util";

@Injectable()
export class OrderService {
  constructor(private readonly repository: OrderRepository, private readonly commodityService: CommodityService) {
  }

  async create(body: CreateOrderDto) {
    return await this.repository.create(body);
  }

  async findAll(
    skip: number,
    take: number,
    paidType?: PaidEnum,
    customer?: string,
    payType?: PaymentType,
  ) {
    const search = searchName(customer);

    return await this.repository.findAll(skip, take, paidType, search?.firstName, search?.lastName, payType);
  }

  async findOne(id: number) {
    const order = await this.repository.findOne(id);
    const commodities = order.commodities.map(commodity => this.commodityService.handleCommodity(commodity));
    return Object.assign(order, {commodities});
  }

  async update(id: number, updates: UpdateOrderDto) {
    return await this.repository.update(id, updates);
  }

  async remove(id: number) {
    await this.repository.remove(id);
  }

  /*
  * Tổng tiền nhiều đơn hàng
  * */
  totalPayOrder(orders: any[]) {
    return orders.map(order => {
      const totalCommodity = order.commodities
        ?.map((commodity) => this.commodityService.totalCommodity(commodity))
        ?.reduce((a, b) => a + b, 0);

      return Math.round(totalCommodity / 1000) * 1000;
    }).reduce((a, b) => a + b, 0);
  }
}
