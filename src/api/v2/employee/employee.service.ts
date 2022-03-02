import {Injectable, NotFoundException} from "@nestjs/common";
import {CreateEmployeeDto} from "./dto/create-employee.dto";
import {EmployeeRepository} from "./employee.repository";
import {UpdateEmployeeDto} from "./dto/update-employee.dto";
import {SearchEmployeeDto} from "./dto/search-employee.dto";
import {ProfileEntity} from "../../../common/entities/profile.entity";
import {SearchEmployeeByOvertimeDto} from "./dto/search-employee-by-overtime.dto";


@Injectable()
export class EmployeeService {
  constructor(private readonly repository: EmployeeRepository) {
  }

  async create(body: CreateEmployeeDto) {
    return await this.repository.create(body);
  }

  async findAll(
    profile: ProfileEntity,
    skip: number,
    take: number,
    search?: Partial<SearchEmployeeDto>
  ) {
    return await this.repository.findAll(profile, skip, take, search);
  }

  async findEmployeesByOvertime(profile: ProfileEntity, search: SearchEmployeeByOvertimeDto) {
    const salaries = await this.repository.findEmployeesByOvertime(profile, search);
    return salaries.map(salary => {
      return {
        employee: salary.payroll.employee,
        salary: Object.assign(salary, {payroll: null}),
      };
    });
  }

  findBy(query: any) {
    return this.repository.findBy(query);
  }

  findFirst(query: any) {
    return this.repository.findFirst(query);
  }

  async findOne(id: number) {
    const employee = await this.repository.findOne(id);
    if (!employee) {
      throw new NotFoundException(`Not Found employee by Id ${id}`);
    }
    const contactType =
      employee.contracts[0]?.createdAt && employee.contracts[0]?.expiredAt
        ? "Có thời hạn"
        : employee.contracts[0]?.createdAt && !employee.contracts[0]?.expiredAt
        ? "Vô  thời hạn"
        : "Chưa có hợp đồng";

    const salaryHistories = employee.salaryHistories.map(salary => Object.assign(salary, {datetime: salary.timestamp}));
    return Object.assign(employee, {contractType: contactType, salaryHistories});
  }

  async update(id: number, updates: UpdateEmployeeDto) {
    const found = await this.findOne(id);
    if (!found) {
      throw new NotFoundException();
    }

    return await this.repository.update(id, updates);
  }

  async leave(id: number, leftAt: Date) {
    return this.repository.leave(id, leftAt);
  }

  async remove(id: number, workHistory?: boolean) {
    return this.repository.remove(id, workHistory);
  }
}
