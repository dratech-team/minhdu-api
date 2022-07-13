import {BadRequestException, forwardRef, Inject, Injectable} from "@nestjs/common";
import {CreateOrderDto} from "./dto/create-order.dto";
import {UpdateOrderDto} from "./dto/update-order.dto";
import {OrderRepository} from "./order.repository";
import {PaymentHistoryService} from "../histories/payment-history/payment-history.service";
import {Response} from "express";
import {exportExcel} from "../../../core/services/export.service";
import {SearchOrderDto} from "./dto/search-order.dto";
import {OrderEntity} from "./entities/order.entity";
import {ItemExportDto} from "../../../common/interfaces/items-export.dto";
import * as _ from 'lodash';
import {Commodity} from '@prisma/client';
import {CommodityService} from "../commodity/commodity.service";

@Injectable()
export class OrderService {
  constructor(
    private readonly repository: OrderRepository,
    private readonly paymentService: PaymentHistoryService,
    @Inject(forwardRef(() => CommodityService))
    private readonly commodityService: CommodityService,
  ) {
  }

  /// FIXME: Hơi dài dòng. Sau khi tạo thành công thì update lại tổng tiền của hàng hoá
  async create(body: CreateOrderDto) {
    // for (let i = 0; i < 50; i++) {
    //   const order = await this.repository.create({
    //     createdAt: new Date(),
    //     provinceId: 4,
    //     customerId: 123 + i,
    //     commodityIds: [31 + i]
    //   });
    //   console.log("Đã tạo orderId", order.id);
    //   await this.update(order.id, {});
    // }
    const order = await this.repository.create(body);
    this.update(order.id, {}).then();
    return this.mapOrder(order);
  }

  async findAll(search: SearchOrderDto) {
    const resultFull = await this.repository.findAll(Object.assign({}, search, {take: undefined, skip: undefined}));
    const result = await this.repository.findAll(search);

    const orders = result.data.map((order) => this.mapOrder(order));
    return {
      total: result.total,
      data: orders,
      commodityUniq: this.orderUniq(resultFull.data),
      commodityTotal: resultFull.data.map(order => this.commodityService.totalCommodities(order.commodities)).reduce((a, b) => a + b, 0)
    };
  }

  async findOne(id: number) {
    const order = await this.repository.findOne(id);
    if (!order) {
      throw new BadRequestException(`Not found id ${id}`);
    }
    return this.mapOrder(order);
  }

  async update(id: number, updates: Partial<UpdateOrderDto>) {
    const found = await this.findOne(id);
    // Đơn hàng giao thành công thì không được phép sửa
    if (found.deliveredAt) {
      throw new BadRequestException("Không được sửa đơn hàng đã được giao thành công.!!!");
    }
    const order = await this.repository.update(id, Object.assign(updates, {total: found.commodityTotal}));
    return this.mapOrder(order);
  }

  async remove(id: number, canceled?: boolean) {
    const order = await this.findOne(id);
    if (order.deliveredAt) {
      throw new BadRequestException(
        "Đơn hàng đã giao thành công. Bạn không được phép xóa."
      );
    }
    return await this.repository.remove(id, canceled);
  }

  async hide(id: number, hide: boolean) {
    const order = this.repository.update(id, {hide: hide});
    return this.mapOrder(order);
  }

  async restore(id: number) {
    const order = this.repository.update(id, {deliveredAt: null});
    return this.mapOrder(order);
  }

  itemsExport() {
    const customs = {
      customer: 'Tên khách hàng',
      createdAt: 'Ngày tạo',
      deliveredAt: 'Ngày giao hàng',
      bsx: 'Xe xuất',
      ward: 'Điểm đến',
      commodities: 'Hàng hoá',
      total: 'Tiền hàng',
      payment: 'Thanh toán',
      unit: 'Đơn vị tiền',
      note: 'Diễn giải',
      status: 'Trạng thái đơn hàng',
    };
    return Object.keys(customs).map((key) => ({key: key, value: customs[key]}));
  }

  async export(response: Response, items: ItemExportDto[], search: SearchOrderDto) {
    const data = await this.findAll(search);
    const customs = items.reduce((a, v, index) => ({...a, [v['key']]: v['value']}), {});

    return await exportExcel(
      response,
      {
        title: `Danh sách đơn hàng`,
        customHeaders: Object.values(customs),
        customKeys: Object.keys(customs),
        name: "data",
        data: data.data.map((e) => ({
          name: e.customer.firstName + e.customer.lastName,
          createdAt: e.createdAt,
          lengthTotal: e.commodities.length,
          commodityTotal: this.commodityService.totalCommodities(e.commodities),
          payTotal: this.paymentService.totalPayment(e.paymentHistories),
          debtTotal:
            this.paymentService.totalPayment(e.paymentHistories) -
            this.commodityService.totalCommodities(e.commodities),
          explain: e.explain,
        })),
      },
      200
    );
  }

  private orderUniq(order: OrderEntity[]) {
    const flatCommodities = _.flattenDeep(order.map(order => order.commodities));
    const uniqCommodities: Commodity[] = _.uniqBy(flatCommodities, "code");

    return uniqCommodities.map(uniq => {
      const amount = flatCommodities.filter(flat => flat.code === uniq.code).map(c => c.amount + (c.gift || 0) + ((c.more as any)?.amount || 0)).reduce((a, b) => a + b);
      return {
        code: uniq.code,
        name: uniq.name,
        amount,
      };
    });
  }

  private mapOrder(order) {
    const commodityTotal = this.commodityService.totalCommodities(
      order.commodities
    );
    return Object.assign(
      order,
      {
        commodities: order.commodities.map((commodity) => {
            return this.commodityService.handleCommodity(commodity);
          }
        ),
      },
      {commodityTotal: commodityTotal},
      {paymentTotal: this.paymentService.totalPayment(order.paymentHistories)}
    );
  }
}
