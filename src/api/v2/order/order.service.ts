import {Injectable} from "@nestjs/common";
import {CreateOrderDto} from "./dto/create-order.dto";
import {UpdateOrderDto} from "./dto/update-order.dto";
import {OrderRepository} from "./order.repository";
import {CommodityService} from "../commodity/commodity.service";
import {PaidEnum} from "./enums/paid.enum";
import {Commodity, PaymentType} from "@prisma/client";
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
    return this.repository.findOne(id);
  }

  async update(id: number, updates: UpdateOrderDto) {
    if (!updates.paidAt && updates.paidTotal) {
      updates.paidAt = new Date();
    }
    const order = await this.findOne(id);
    updates.debt = this.debtRemaining(order);

    return await this.repository.update(id, updates);
  }

  async remove(id: number) {
    await this.repository.remove(id);
  }

  debtRemaining(order: any) {
    let totalCommodity = 0;
    order.commodities.forEach((commodity: Commodity) => totalCommodity += commodity.price * commodity.amount);

    return order.paidTotal - totalCommodity;
  }
}
