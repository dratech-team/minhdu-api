import {BadRequestException, Injectable, Query} from "@nestjs/common";
import {CreateCustomerDto} from "./dto/create-customer.dto";
import {UpdateCustomerDto} from "./dto/update-customer.dto";
import {CustomerRepository} from "./customer.repository";
import {CustomerResource, CustomerType} from "@prisma/client";
import {searchName} from "../../../utils/search-name.util";
import {OrderService} from "../order/order.service";
import {PaymentHistoryService} from "../payment-history/payment-history.service";
import {CreatePaymentHistoryDto} from "../payment-history/dto/create-payment-history.dto";

@Injectable()
export class CustomerService {
  constructor(
    private readonly repository: CustomerRepository,
    private readonly orderService: OrderService,
    private readonly payHistoryService: PaymentHistoryService
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

    // if (isPotential) {
    //   isPotential = JSON.parse(String(isPotential));
    // }

    return await this.repository.findAll(skip, take, search?.firstName, search?.lastName, phone, nationId, type, resource, isPotential);
  }

  async findOne(id: number) {
    const customer = await this.repository.findOne(id);
    const totalOrder = this.orderService.totalPayOrder(customer.orders);
    const totalPay = this.payHistoryService.totalPayment(customer.paymentHistories);

    return Object.assign(customer, {debt: totalPay - totalOrder});
  }

  async update(id: number, updates: UpdateCustomerDto) {
    return await this.repository.update(id, updates);
  }

  async remove(id: number) {
    return await this.repository.remove(id);
  }

  async payment(id: number, payment: CreatePaymentHistoryDto) {
    if (payment.orderId) {
      const customer = await this.findOne(id);
      const found = customer?.orders?.map(order => order.id)?.includes(+payment.orderId);
      if (!found) {
        throw new BadRequestException(`Mã đơn hàng ${payment.orderId} Không thuộc khách hàng ${customer.lastName}. Vui lòng kiểm tra lại hoặc liên hệ admin để hỗ trợ.`);
      }
    }
    return await this.payHistoryService.create(id, payment);
  }
}
