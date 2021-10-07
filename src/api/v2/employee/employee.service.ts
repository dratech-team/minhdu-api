import {Injectable, NotFoundException} from "@nestjs/common";
import {CreateEmployeeDto} from "./dto/create-employee.dto";
import {EmployeeRepository} from "./employee.repository";
import {UpdateEmployeeDto} from "./dto/update-employee.dto";
import {SearchEmployeeDto} from "./dto/search-employee.dto";
import {ProfileEntity} from "../../../common/entities/profile.entity";


@Injectable()
export class EmployeeService {
  constructor(private readonly repository: EmployeeRepository) {
  }

  // @ts-ignore
  async create(body: CreateEmployeeDto) {
    return await this.repository.create(body);
  }

  // @ts-ignore
  async findAll(
    profile: ProfileEntity,
    skip: number,
    take: number,
    search?: Partial<SearchEmployeeDto>
  ) {
    return await this.repository.findAll(profile, skip, take, search);
  }

  findBy(query: any) {
    return this.repository.findBy(query);
  }

  findFirst(query: any) {
    return this.repository.findFirst(query);
  }

  async findOne(id: number) {
    const employee = await this.repository.findOne(id);
    const contactType =
      employee.contracts[0]?.createdAt && employee.contracts[0]?.expiredAt
        ? "Có thời hạn"
        : employee.contracts[0]?.createdAt && !employee.contracts[0]?.expiredAt
        ? "Vô  thời hạn"
        : "Chưa có hợp đồng";
    return Object.assign(employee, {contractType: contactType});
  }

  async update(id: number, updates: UpdateEmployeeDto) {
    const found = await this.findOne(id);
    if (!found) {
      throw new NotFoundException();
    }

    return await this.repository.update(id, updates);
  }

  async remove(id: number) {
    return this.repository.remove(id);
  }

  async generateEmployeeCode(branchCode: string): Promise<string> {
    const count = await this.repository.count();
    let gen: string;
    if (count < 10) {
      gen = "0000";
    } else if (count < 100) {
      gen = "000";
    } else if (count < 1000) {
      gen = "00";
    } else if (count < 10000) {
      gen = "0";
    }
    return `${branchCode}${gen}${count + 1}`;
  }

  /*Generate qrcode*/
  // updateQrCodeEmployee(employeeId: number, code: string) {
  //   qr.toDataURL(code).then((qrCode) =>
  //     this.repository.updateQrCode(employeeId, qrCode)
  //   );
  // }
}
