import {BadRequestException, Injectable} from "@nestjs/common";
import {CreateOrderDto} from "./dto/create-order.dto";
import {UpdateOrderDto} from "./dto/update-order.dto";
import {OrderRepository} from "./order.repository";
import {CommodityService} from "../commodity/commodity.service";
import {PaymentHistoryService} from "../payment-history/payment-history.service";
import {Response} from "express";
import {exportExcel} from "../../../core/services/export.service";
import {SearchOrderDto} from "./dto/search-order.dto";
import {FullOrder} from "./entities/order.entity";

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

  async findAll(search: SearchOrderDto) {
    const result = await this.repository.findAll(search);

    return {
      total: result.total,
      data: result.data.map((order) => {
        return Object.assign(
          order,
          {
            commodityTotal: this.commodityService.totalCommodities(
              order.commodities
            ),
          },
          {
            paymentTotal: this.paymentService.totalPayment(
              order.payments
            ),
          }
        );
      }),
    };
  }

  async findOne(id: number) {
    const order = await this.repository.findOne(id);
    if (!order) {
      throw new BadRequestException(`Not found id ${id}`);
    }
    /// Phương thức này fai đứng trước map commodities
    const commodityTotal = this.commodityService.totalCommodities(
      order.commodities
    );
    return Object.assign(
      order,
      {
        commodities: order.commodities.map((commodity) =>
          this.commodityService.handleCommodity(commodity)
        ),
      },
      {commodityTotal: commodityTotal},
      {paymentTotal: this.paymentService.totalPayment(order.payments)}
    );
  }

  async update(id: number, updates: UpdateOrderDto) {
    const found = await this.findOne(id);

    // Đơn hàng giao thành công thì không được phép sửa
    if (found.deliveredAt) {
      throw new BadRequestException("Không được sửa đơn hàng đã được giao thành công.");
    }
    return await this.repository.update(id, Object.assign(updates, updates.deliveredAt ? {total: found.commodityTotal} : {}));
  }

  updateHide(id: number, hide: boolean) {
    return this.repository.update(id, {hide: hide});
  }

  async remove(id: number) {
    const order = await this.findOne(id);
    if (order.deliveredAt) {
      throw new BadRequestException(
        "Đơn hàng đã giao thành công. Bạn không được phép xóa."
      );
    }
    await this.repository.remove(id);
  }

  orderTotal(orders: FullOrder[]): number {
    return orders
      .map((order) => this.commodityService.totalCommodities(order.commodities))
      .reduce((a, b) => a + b, 0);
  }

  async export(
    response?: Response,
    customerId?: number,
    search?: SearchOrderDto
  ) {
    const data = await this.findAll(search);
    return await exportExcel(
      response,
      {
        title: `Danh sách đơn hàng`,
        customHeaders: [
          "Khách hàng",
          "Ngày tạo",
          "Điểm đến",
          "Tổng đơn hàng",
          "Tổng Tiền hàng",
          "Tổng tiền đã thanh toán",
          "Tổng tiền chưa thanh toán",
          "Diễn giả",
        ],
        customKeys: [
          "name",
          "createdAt",
          "destination",
          "lengthTotal",
          "commodityTotal",
          "payTotal",
          "debtTotal",
          "explain",
        ],
        name: "data",
        data: data.data.map((e) => ({
          name: e.customer.firstName + e.customer.lastName,
          createdAt: e.createdAt,
          destination: `${e.destination.name}, ${e.destination.district.name}, ${e.destination.district.province.name}, ${e.destination.district.province.nation.name}`,
          lengthTotal: e.commodities.length,
          commodityTotal: this.commodityService.totalCommodities(e.commodities),
          payTotal: this.paymentService.totalPayment(e.payments),
          debtTotal:
            this.paymentService.totalPayment(e.payments) -
            this.commodityService.totalCommodities(e.commodities),
          explain: e.explain,
        })),
      },
      200
    );
  }
}
