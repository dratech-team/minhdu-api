import {BadRequestException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../../prisma.service";
import {CreateEmployeeDto} from "./dto/create-employee.dto";
import {UpdateEmployeeDto} from "./dto/update-employee.dto";
import {ResponsePagination} from "../../../common/entities/response.pagination";
import {Employee} from "@prisma/client";
import {InterfaceRepository} from "../../../common/repository/interface.repository";
import {firstMonth, lastMonth} from "../../../utils/datetime.util";

@Injectable()
export class EmployeeRepository implements InterfaceRepository<Employee> {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateEmployeeDto) {
    try {
      return await this.prisma.employee.create({
        data: body,
        include: {
          position: {include: {department: {include: {branch: true}}}},
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async count(): Promise<number> {
    return await this.prisma.employee.count();
  }

  async findAll(branchId: number, skip: number, take: number, search?: string): Promise<ResponsePagination<Employee>> {

    const where = {
      leftAt: null,
      branchId,
      code: {startsWith: search}
    };

    try {
      const [total, data] = await Promise.all([
        this.prisma.employee.count({where, skip, take,}),
        this.prisma.employee.findMany({
          where, skip, take,
          include: {
            position: {include: {department: {include: {branch: true}}}},
          }
        })
      ]);
      return {total, data};
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  async findBy(query: any) {
   return  await this.prisma.employee.findMany({
      where: query,
      include: {payrolls: true, salaries: true}
    });
  }

  async findFirst(query: any) {
   return  await this.prisma.employee.findFirst({
      where: query,
      include: {payrolls: true, salaries: true}
    });
  }

  async findOne(id: number) {
    try {
      return await this.prisma.employee.findUnique({
        where: {id: id},
        include: {
          degrees: true,
          contracts: true,
          relatives: true,
          banks: true,
          position: {include: {department: {include: {branch: true}}}},
          salaries: true,
          payrolls: true,
        }
      });
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  async update(id: number, updates: UpdateEmployeeDto) {
    try {
      return await this.prisma.employee.update({
        where: {id: id},
        data: updates
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  /* Nghỉ việc */
  async remove(id: number) {
    this.prisma.employee.delete({where: {id: id}}).catch(err => {
      console.error(err);
      throw new BadRequestException(err);
    });
  }

  connectSalary(employeeId: number, salaryId: number) {
    this.prisma.employee.update({
      where: {id: employeeId},
      data: {
        salaries: {
          connect: {id: salaryId}
        }
      }
    }).then();
  }

  // updateQrCode(employeeId: number, qrCode: string) {
  //   this.prisma.employee.update({
  //     where: {id: employeeId},
  //     data: {qrCode}
  //   }).then();
  // }
}
