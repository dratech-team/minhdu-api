import {BadRequestException, ConflictException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../../prisma.service";
import {CreateEmployeeDto} from "./dto/create-employee.dto";
import {UpdateEmployeeDto} from "./dto/update-employee.dto";
import {ResponsePagination} from "../../../common/entities/response.pagination";
import {Employee, GenderType} from "@prisma/client";
import {firstMonth, lastMonth} from "../../../utils/datetime.util";

@Injectable()
export class EmployeeRepository {
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
      if (err?.response?.code === "P2002") {
        throw new ConflictException('CMND nhân viên đã tồn tại', err);
      } else {
        throw new BadRequestException(err);
      }
    }
  }

  async count(): Promise<number> {
    return await this.prisma.employee.count();
  }

  async findAll(
    branchId: number,
    skip: number,
    take: number,
    code: string,
    firstName: string,
    lastName: string,
    gender: GenderType,
    createdAt: Date,
    isFlatSalary: boolean,
    branch: string,
    department: string,
    position: string,
  ): Promise<ResponsePagination<Employee>> {
    try {
      const [total, data] = await Promise.all([
        this.prisma.employee.count({
          where: {
            leftAt: null,
            position: {department: {branch: {id: branchId}}}
          },
        }),
        this.prisma.employee.findMany({
          where: {
            leftAt: null,
            position: {department: {branch: {id: branchId}}},
            AND: {
              code: {startsWith: code},
              AND: {
                firstName: {startsWith: firstName, mode: 'insensitive'},
                lastName: {startsWith: lastName, mode: 'insensitive'},
              },
              gender: gender ? {equals: gender}: {},
              isFlatSalary: {equals: isFlatSalary},
              position:
                {
                  name: {startsWith: position, mode: 'insensitive'},
                  department: {
                    name: {startsWith: department, mode: 'insensitive'},
                    branch: {
                      name: {startsWith: branch, mode: 'insensitive'}
                    }
                  },
                },
            }
          },
          skip,
          take,
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
    return await this.prisma.employee.findMany({
      where: query,
      include: {payrolls: true, salaries: true}
    });
  }

  async findFirst(query: any) {
    return await this.prisma.employee.findFirst({
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
          historySalaries: true,
          workHistories: {
            include: {
              position: {
                include: {
                  department: {
                    include: {
                      branch: true
                    }
                  }
                }
              }
            }
          },
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
        data: updates,
        // data: {
        //   salaries: {connect: {id: updates.salaryId}},
        //   firstName: updates.firstName,
        //   lastName: updates.lastName,
        //   wardId: updates.wardId,
        //   positionId: updates.positionId,
        //   workedAt: updates.workedAt,
        //   email: updates.email,
        //   zalo: updates.zalo,
        //   facebook: updates.facebook,
        //   idCardAt: updates.idCardAt,
        //   address: updates.address,
        //   avt: updates.avt,
        //   birthday: updates.birthday,
        //   workPhone: updates.workPhone,
        //   gender: updates.gender,
        //   identify: updates.identify,
        //   phone: updates.phone,
        //   birthplace: updates.birthplace,
        //   religion: updates.religion,
        //   mst: updates.mst,
        //   ethnicity: updates.ethnicity,
        //   issuedBy: updates.issuedBy,
        //   createdAt: updates.createdAt,
        //   note: updates.note,
        // }
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
