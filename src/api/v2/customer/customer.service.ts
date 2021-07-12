import {Injectable} from "@nestjs/common";
import {CreateCustomerDto} from "./dto/create-customer.dto";
import {UpdateCustomerDto} from "./dto/update-customer.dto";
import {CustomerRepository} from "./customer.repository";
import {CustomerResource, CustomerType} from "@prisma/client";
import {searchName} from "../../../utils/search-name.util";

@Injectable()
export class CustomerService {
  constructor(private readonly repository: CustomerRepository) {
  }

  async create(body: CreateCustomerDto) {
    return await this.repository.create(body);
  }

  async findAll(
    skip: number,
    take: number,
    name?: string,
    phone?: string,
    nationId?: number,
    type?: CustomerType,
    resource?: CustomerResource,
    isPotential?: boolean
  ) {
    const search = searchName(name);

    if (isPotential) {
      isPotential = JSON.parse(String(isPotential));
    }

    if (nationId) {
      nationId = Number(nationId);
    }

    return await this.repository.findAll(search?.firstName, search?.lastName, phone, nationId, type, resource, isPotential);
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
}
