import {Injectable} from "@nestjs/common";
import {CreateCustomerDto} from "./dto/create-customer.dto";
import {UpdateCustomerDto} from "./dto/update-customer.dto";
import {CustomerRepository} from "./customer.repository";
import {Customer, CustomerResource, CustomerType} from "@prisma/client";
import {searchName} from "../../../utils/search-name.util";
import {CreatePaymentHistoryDto} from "../payment-history/dto/create-payment-history.dto";
import {CommodityService} from "../commodity/commodity.service";
import {PaymentHistoryService} from "../payment-history/payment-history.service";
import {OrderService} from "../order/order.service";

@Injectable()
export class CustomerService {
  constructor(
    private readonly repository: CustomerRepository,
    private readonly paymentService: PaymentHistoryService,
    private readonly orderService: OrderService,
  ) {
  }

  async create(body: CreateCustomerDto) {
    return await this.repository.create(body);
  }

  async findAll(
    skip: number,
    take: number,
    name: string,
    phone: string,
    nationId: number,
    type: CustomerType,
    resource: CustomerResource,
    isPotential: number
  ) {
    const search = searchName(name);
    return await this.repository.findAll(skip, take, search?.firstName, search?.lastName, phone, nationId, type, resource, isPotential);
  }

  async findOne(id: number) {
    const customer = await this.repository.findOne(id);
    const order = this.orderService.orderTotal(customer.orders);

    const payment = this.paymentService.totalPayment(customer.paymentHistories);
    const debt = payment - order;
    return Object.assign(customer, {debt});
  }

  async update(id: number, updates: UpdateCustomerDto) {
    return await this.repository.update(id, updates);
  }

  async remove(id: number) {
    return await this.repository.remove(id);
  }

  async payment(id: Customer['id'], payment: CreatePaymentHistoryDto) {
    return await this.repository.payment(id, payment);
  }
}
