import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import {CreateEmployeeDto} from "./dto/create-employee.dto";
import {EmployeeRepository} from "./employee.repository";
import {Sort, UpdateEmployeeDto} from "./dto/update-employee.dto";
import {SearchEmployeeDto} from "./dto/search-employee.dto";
import {ProfileEntity} from "../../../common/entities/profile.entity";
import {SearchEmployeeByOvertimeDto} from "./dto/search-employee-by-overtime.dto";
import {Response} from "express";
import {ItemExportDto} from "../../../common/interfaces/items-export.dto";
import {SearchExportEmployeeDto} from "./dto/search-export.employee.dto";
import {EmployeeType, GenderType} from "@prisma/client";

@Injectable()
export class EmployeeService {
  constructor(private readonly repository: EmployeeRepository) {
  }

  async create(body: CreateEmployeeDto) {
    return await this.repository.create(body);
  }

  async findAll(
    profile: ProfileEntity,
    search?: Partial<SearchEmployeeDto>
  ) {
    return await this.repository.findAll(profile, search);
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
    return this.mapToEmployee(employee);
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

  async sortable(sort: Sort[]) {
    return this.repository.sortable(sort);
  }

  async export(
    response: Response,
    profile: ProfileEntity,
    search: SearchExportEmployeeDto,
    items: ItemExportDto[],
  ) {
    try {
      const {data} = await this.findAll(profile, Object.assign(search, {take: undefined, skip: undefined}));

      const employees = await Promise.all(
        data.map(async (employee) => {
          const branch = employee.branch.name;
          const position = employee.position.name;
          const type = employee.type === EmployeeType.FULL_TIME ? "Nhân viên" : "Bán thời gian";
          const isFlatSalary = employee.isFlatSalary ? 'Cố định' : "Không cố định";
          const gender = employee.gender === GenderType.FEMALE ? "Nữ" : "Nam";
          const province = employee.ward.district.province.name;
          const district = employee.ward.district.name;
          const ward = employee.ward.name;
          return Object.assign(employee, {branch, position, isFlatSalary, type, province, district, ward, gender});
        })
      );

      return this.repository.export(response, profile, {
        filename: search.filename,
        title: "Danh sách nhân viên"
      }, items, employees);
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  private mapToEmployee(employee) {
    const salaryHistories = employee.salaryHistories.map(salary => Object.assign(salary, {datetime: salary.timestamp}));
    const contactType =
      employee.contracts[0]?.createdAt && employee.contracts[0]?.expiredAt
        ? "Có thời hạn"
        : employee.contracts[0]?.createdAt && !employee.contracts[0]?.expiredAt
        ? "Vô  thời hạn"
        : "Chưa có hợp đồng";

    return Object.assign(employee, {contractType: contactType, salaryHistories});
  }
}
