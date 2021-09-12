import {Injectable} from "@nestjs/common";
import {CreateCustomerDto} from "./dto/create-customer.dto";
import {UpdateCustomerDto} from "./dto/update-customer.dto";
import {CustomerRepository} from "./customer.repository";
import {Customer, GenderType} from "@prisma/client";
import {searchName} from "../../../utils/search-name.util";
import {CreatePaymentHistoryDto} from "../payment-history/dto/create-payment-history.dto";
import {Response} from "express";
import {PaymentHistoryService} from "../payment-history/payment-history.service";
import {OrderService} from "../order/order.service";
import {exportExcel} from "../../../core/services/export.service";
import {SearchCustomerDto} from "./dto/search-customer.dto";
import * as moment from "moment";

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
    search?: Partial<SearchCustomerDto>,
  ) {
    const name = searchName(search?.name);
    return await this.repository.findAll(skip, take, name?.firstName, name?.lastName, search?.phone, search?.nationId, search?.type, search?.resource, search?.isPotential);
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

  async export(response: Response, search?: Partial<SearchCustomerDto>) {
    const data = await this.findAll(undefined, undefined, search);
    return await exportExcel(response, {
      title: "Danh sách khách hàng",
      name: "Danh sách khách hàng",
      customHeaders: ["Tên", "Giới tính", "Tuổi", "CMND/CCCD", "Ngày cấp", "Nơi cấp", "Địa chỉ", "Số điện thoại", "Khách hàng tiềm năng"],
      customKeys: ["name", "gender", "age", "identify", "idCardAt", "issuedBy", "address", "phone", "isPotential"],
      data: data.data.map(customer => {
        return {
          name: customer.firstName + customer.lastName,
          gender: customer.gender === GenderType.MALE ? "Nam" : customer.gender === GenderType.FEMALE ? "Nữ" : "Khác",
          age: moment().diff(customer.birthday, "years"),
          identify: customer.identify,
          idCardAt: customer.idCardAt,
          issuedBy: customer.issuedBy,
          address: customer.address,
          phone: customer.phone,
          isPotential: customer.isPotential,
        };
      }),
    }, 200);
  }

  async payment(id: Customer['id'], payment: CreatePaymentHistoryDto) {
    return await this.repository.payment(id, payment);
  }
}
