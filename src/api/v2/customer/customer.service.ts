import {BadRequestException, Injectable} from "@nestjs/common";
import {CreateCustomerDto} from "./dto/create-customer.dto";
import {UpdateCustomerDto} from "./dto/update-customer.dto";
import {CustomerRepository} from "./customer.repository";
import {Customer, CustomerResource, CustomerType} from "@prisma/client";
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
    return await this.repository.findOne(id);
  }

  async update(id: number, updates: UpdateCustomerDto) {
    return await this.repository.update(id, updates);
  }

  async remove(id: number) {
    return await this.repository.remove(id);
  }

  async payment(id: Customer['id'], payment: CreatePaymentHistoryDto) {
    /// find an available customer by id
    const customer = await this.findOne(id);

    /// Throw an error if order id no exist by this customer
    const found = customer?.orders?.map(order => order.id)?.includes(+payment.orderId);
    if (!found) {
      return new BadRequestException(`Mã đơn hàng ${payment.orderId} Không thuộc khách hàng ${customer.lastName}. Vui lòng kiểm tra lại hoặc liên hệ admin để hỗ trợ.`);
    }
    return await this.repository.transactionDebt(id, payment);
  }
}
