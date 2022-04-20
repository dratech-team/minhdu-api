import {Injectable} from "@nestjs/common";
import {CreateCustomerDto} from "./dto/create-customer.dto";
import {UpdateCustomerDto} from "./dto/update-customer.dto";
import {CustomerRepository} from "./customer.repository";
import {Customer, GenderType} from "@prisma/client";
import {CreatePaymentHistoryDto} from "../histories/payment-history/dto/create-payment-history.dto";
import {Response} from "express";
import {exportExcel} from "../../../core/services/export.service";
import {SearchCustomerDto} from "./dto/search-customer.dto";
import * as moment from "moment";

@Injectable()
export class CustomerService {
  constructor(
    private readonly repository: CustomerRepository,
  ) {
  }

  async create(body: CreateCustomerDto) {
    return await this.repository.create(body);
  }

  async findAll(search: SearchCustomerDto) {
    return await this.repository.findAll(search);
  }

  findOne(id: number) {
    return this.repository.findOne(id);
  }

  async update(id: number, updates: UpdateCustomerDto) {
    return await this.repository.update(id, updates);
  }

  async remove(id: number) {
    return await this.repository.remove(id);
  }

  async export(response: Response, search: SearchCustomerDto) {
    const data = await this.findAll(search);
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
          isPotential: customer.isPotential
        };
      }),
    }, 200);
  }

  async payment(id: Customer['id'], payment: CreatePaymentHistoryDto) {
    return await this.repository.payment(id, payment);
  }
}
