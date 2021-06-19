import {BadRequestException, ConflictException, Injectable} from "@nestjs/common";
import {CreateEmployeeDto} from "./dto/create-employee.dto";
import {EmployeeRepository} from "./employee.repository";
import {UpdateEmployeeDto} from "./dto/update-employee.dto";
import {BaseEmployeeService} from "./base-employee.service";
import {ResponsePagination} from "../../../common/entities/response.pagination";
import {Employee} from "@prisma/client";
import {PositionService} from "../position/position.service";

@Injectable()
export class EmployeeService implements BaseEmployeeService {
  constructor(
    private readonly repository: EmployeeRepository,
    private readonly positionService: PositionService
  ) {
  }

  /**
   * Thêm thông tin nhân viên và lương căn bản ban đầu
   * */
  async create(body: CreateEmployeeDto) {
    try {
      /**
       * Generate mã nhân viên dựa trên code branch
       * */
      const res = await this.positionService.findBranch(body.positionId);
      body.code = await this.generateEmployeeCode(res.department.branch.code);

      return await this.repository.create(body);
    } catch (err) {
      console.error(err);
      if (err?.response?.code === "P2002") {
        throw new ConflictException('CMND nhân viên đã tồn tại', err);
      }
      throw new BadRequestException(err);
    }
  }

  async findAll(
    branchId: number,
    skip: number,
    take: number,
    search?: string
  ): Promise<ResponsePagination<Employee>> {
    return await this.repository.findAll(branchId, skip, take, search);
  }

  findBy(branchId: number) {
    return this.repository.findBy(branchId);
  }

  async findOne(id: number) {
    return this.repository.findOne(id);
  }

  async update(id: number, updates: UpdateEmployeeDto) {
    return this.repository.update(id, updates);
  }

  async remove(id: number) {
    return this.repository.remove(id);
  }

  connectSalary(employeeId: number, salaryId: number): void {
    this.repository.connectSalary(employeeId, salaryId);
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
