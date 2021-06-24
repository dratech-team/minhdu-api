import {BadRequestException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../../prisma.service";
import {CreateEmployeeDto} from "./dto/create-employee.dto";
import {UpdateEmployeeDto} from "./dto/update-employee.dto";
import {ResponsePagination} from "../../../common/entities/response.pagination";
import {Employee} from "@prisma/client";
import {InterfaceRepository} from "../../../common/repository/interface.repository";

@Injectable()
export class EmployeeRepository implements InterfaceRepository<Employee> {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateEmployeeDto) {
    try {
      return await this.prisma.employee.create({
        data: {
          code: body.code,
          createdAt: body.createdAt,
          workedAt: body.workedAt,
          isFlatSalary: body.isFlatSalary,
          position: {connect: {id: body.positionId}},
          note: body.note,
          profile: {
            create: body.profile
          }
        },
        include: {
          profile: true,
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
            profile: true,
          }
        })
      ]);
      return {total, data};
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  async findBy(branchId: number) {
    return await this.prisma.employee.findMany({
      where: {position: {department: {branch: {id: branchId}}}},
      include: {payrolls: true, salaries: true}
    });
  }

  async findOne(id: number) {
    try {
      const res = await this.prisma.employee.findUnique({
        where: {id: id},
        include: {
          profile: {
            include: {
              ward: {
                include: {
                  district: {
                    include: {
                      province: {
                        include: {
                          nation: true,
                        }
                      }
                    }
                  }
                },
              },
            }
          },
          social: true,
          degrees: true,
          contracts: true,
          relatives: {
            include: {
              profile: true
            }
          },
          banks: true,
          position: {include: {department: {include: {branch: true}}}},
          salaries: true,
          payrolls: true,
        }
      });
      return res;
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  async update(id: number, updates: UpdateEmployeeDto) {
    try {
      return await this.prisma.employee.update({
        where: {id: id},
        data: {
          leftAt: updates.leftAt,
          position: {connect: {id: updates.positionId}},
          profile: {update: updates.profile},
          social: {upsert: {create: updates.social, update: updates.social}},
          workedAt: updates.workedAt,
          createdAt: updates.createdAt,
          note: updates.note,
        }
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
