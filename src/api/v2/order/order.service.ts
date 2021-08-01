import {Injectable} from "@nestjs/common";
import {CreateOrderDto} from "./dto/create-order.dto";
import {UpdateOrderDto} from "./dto/update-order.dto";
import {OrderRepository} from "./order.repository";
import {CommodityService} from "../commodity/commodity.service";
import {PaidEnum} from "./enums/paid.enum";
import {PaymentType} from "@prisma/client";
import {searchName} from "../../../utils/search-name.util";
import {PaymentHistoryService} from "../payment-history/payment-history.service";

@Injectable()
export class OrderService {
  constructor(
    private readonly repository: OrderRepository,
    private readonly commodityService: CommodityService,
    private readonly paymentService: PaymentHistoryService,
  ) {
  }

  async create(body: CreateOrderDto) {
    return await this.repository.create(body);
  }

  async findAll(
    skip: number,
    take: number,
    customerId: number,
    paidType?: PaidEnum,
    customer?: string,
    payType?: PaymentType,
  ) {
    const search = searchName(customer);

    const result = await this.repository.findAll(skip, take, customerId, paidType, search?.firstName, search?.lastName, payType);

    return {
      total: result.total,
      data: result.data.map(order => {
        return Object.assign(
          order,
          {commodityTotal: this.commodityService.totalCommodities(order.commodities)},
          {paymentTotal: this.paymentService.totalPayment(order.paymentHistories)}
        );
      })
    };
  }

  async findOne(id: number) {
    const order = await this.repository.findOne(id);
    /// Phương thức này fai đứng trước map commodities
    const commodityTotal = this.commodityService.totalCommodities(order.commodities);
    return Object.assign(
      order,
      {commodities: order.commodities.map(commodity => this.commodityService.handleCommodity(commodity))},
      {commodityTotal: commodityTotal},
      {paymentTotal: this.paymentService.totalPayment(order.paymentHistories)}
    );
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
