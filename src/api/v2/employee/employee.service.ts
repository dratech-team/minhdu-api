import {Injectable} from '@nestjs/common';
import {CreateEmployeeDto} from './dto/create-employee.dto';
import {EmployeeRepository} from "./employee.repository";
import {BranchService} from "../branch/branch.service";
import {SalaryService} from "../salary/salary.service";
import {SalaryType} from '@prisma/client';
import {CreateSalaryDto} from "../salary/dto/create-salary.dto";
import {UpdateEmployeeDto} from "./dto/update-employee.dto";

const qr = require("qrcode");

@Injectable()
export class EmployeeService {
  constructor(
    private readonly repository: EmployeeRepository,
    private readonly branchService: BranchService,
    private readonly salaryService: SalaryService,
  ) {
  }

  /**
   * Thêm thông tin nhân viên và lương căn bản ban đầu
   * */
  async create(body: CreateEmployeeDto) {
    /*Khởi tạo lương cơ bản*/
    const basic = new CreateSalaryDto();
    basic.title = 'Lương cơ bản trích BH';
    basic.price = body.price;
    basic.type = SalaryType.BASIC;
    const salary = await this.salaryService.create(basic);

    /*Generate mã nhân viên dựa trên code branch*/
    const branch = await this.branchService.findOne(body.branchId);
    body.id = await this.generateEmployeeCode(branch.code);

    body.salaryId = salary.id;
    return this.repository.create(body);
  }

  async findAll(branchId: number, skip: number, take: number, search?: string): Promise<any> {
    return this.repository.findAll(branchId, skip, take, search);
  }

  findMany(branchId: number) {
    return this.repository.findMany(branchId);
  }

  async findOne(id: string) {
    return this.repository.findOne(id);
  }


  async update(id: string, updates: UpdateEmployeeDto) {
    return this.repository.update(id, updates);
  }

  async remove(id: string) {
    return this.repository.remove(id);
  }

  async generateEmployeeCode(code: string): Promise<string> {
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
    const id = `${code}${gen}${count + 1}`;
    this.updateQrCodeEmployee(id).then();
    return id;
  }

  async updateQrCodeEmployee(id: string) {
    const qrCode = await qr.toDataURL(id);
    this.repository.updateQrCode(id, qrCode);
  }
}
