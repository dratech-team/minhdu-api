import {BadRequestException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../../prisma.service";
import {CreateEmployeeDto} from "./dto/create-employee.dto";
import {UpdateEmployeeDto} from "./dto/update-employee.dto";
import {firstMonth, lastMonth} from "../../../utils/datetime.util";

@Injectable()
export class EmployeeRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateEmployeeDto) {
    try {
      return await this.prisma.employee.create({
        data: {
          code: body.code,
          identify: body.identify,
          name: body.name,
          address: body.address,
          salaries: {connect: {id: body.salaryId}},
          workedAt: new Date(body.workedAt),
          branch: {connect: {id: body.branchId}},
          department: {connect: {id: body.departmentId}},
          position: {connect: {id: body.positionId}},
          phone: body.phone,
          birthday: new Date(body.birthday),
          idCardAt: new Date(body.idCardAt),
          gender: body.gender,
          note: body.note,
          isFlatSalary: body.isFlatSalary,
          certificate: body.certificate,
          payrolls: {
            create: {
              salaries: {
                connect: {id: body.salaryId}
              }
            }
          }
        },
        include: {
          branch: true,
          department: true,
          position: true
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

  async findAll(branchId: number, skip: number, take: number, search?: string) {
    const where = {
      leftAt: null,
      branchId,
      code: {startsWith: search}
    };

    try {
      const [total, data] = await Promise.all([
        await this.prisma.employee.count({where}),
        this.prisma.employee.findMany({
          where, skip, take,
          include: {
            branch: true,
            department: true,
            position: true
          }
        }),
      ]);
      return {
        total, data
      };
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  async findBy(branchId: number) {
    return await this.prisma.employee.findMany({
      where: {branchId},
      include: {payrolls: true, salaries: true}
    });
  }

  async findOne(id: number) {
    try {
      return await this.prisma.employee.findUnique({
        where: {id: id},
        include: {
          salaries: true,
          branch: true,
          department: true,
          position: true,
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
      return await this.prisma.employee.update({where: {id: id}, data: updates});
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  async remove(id: number) {
    this.prisma.employee.delete({where: {id: id}}).catch((e) => {
      throw new BadRequestException(e);
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

  updateQrCode(employeeId: number, qrCode: string) {
    this.prisma.employee.update({
      where: {id: employeeId},
      data: {qrCode}
    }).then();
  }
}
