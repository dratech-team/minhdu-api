import {BadRequestException, Injectable} from "@nestjs/common";
import {CreateOrderDto} from "./dto/create-order.dto";
import {UpdateOrderDto} from "./dto/update-order.dto";
import {OrderRepository} from "./order.repository";
import {CommodityService} from "../commodity/commodity.service";
import {PaidEnum} from "./enums/paid.enum";
import {Customer, PaymentType, PrismaPromise} from "@prisma/client";
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
    delivered?: number
  ) {
    const search = searchName(customer);

    const result = await this.repository.findAll(skip, take, customerId, paidType, search?.firstName, search?.lastName, payType, delivered);

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
    const found = await this.findOne(id);

    // Đơn hàng giao thành công thì không được phép sửa
    if (found.deliveredAt) {
      return new BadRequestException('Không được sửa đơn hàng đã được giao thành công.');
    }

    // Đơn hàng được update lại hàng hóa thì phải tính lại tổng để update lại dư nợ
    const commodities = await Promise.all(updates.commodityIds.map(async (commodityId) => {
      return await this.findOne(commodityId);
    }));
    updates.totalOrder = this.commodityService.totalCommodities(commodities);

    return await this.repository.update(id, updates);
  }

  async remove(id: number) {
    await this.repository.remove(id);
  }
}
