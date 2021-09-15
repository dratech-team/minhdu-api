import {BadRequestException, ConflictException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../../prisma.service";
import {CreateEmployeeDto} from "./dto/create-employee.dto";
import {UpdateEmployeeDto} from "./dto/update-employee.dto";
import {ResponsePagination} from "../../../common/entities/response.pagination";
import {Employee} from "@prisma/client";
import {SearchEmployeeDto} from "./dto/search-employee.dto";
import {searchName} from "../../../utils/search-name.util";

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
    search?: Partial<SearchEmployeeDto>
  ): Promise<ResponsePagination<Employee>> {
    try {
      const name = searchName(search?.name);

      const [total, data] = await Promise.all([
        this.prisma.employee.count({
          skip: skip ?? undefined,
          take: take ?? undefined,
          where: {
            leftAt: null,
            position: branchId ? {department: {branch: {id: branchId}}} : {},
            code: {startsWith: search?.code, mode: 'insensitive'},
            AND: {
              firstName: {startsWith: name?.firstName, mode: 'insensitive'},
              lastName: {startsWith: name?.lastName, mode: 'insensitive'},
            },
            gender: search?.gender ? {equals: search?.gender} : {},
            isFlatSalary: search?.isFlatSalary === 1 ? true : (search?.isFlatSalary === 0 ? false : undefined),
          },
        }),
        this.prisma.employee.findMany({
          skip: skip ?? undefined,
          take: take ?? undefined,
          where: {
            leftAt: null,
            position: branchId ? {department: {branch: {id: branchId}}} : {},
            code: {startsWith: search?.code, mode: 'insensitive'},
            AND: {
              firstName: {startsWith: name?.firstName, mode: 'insensitive'},
              lastName: {startsWith: name?.lastName, mode: 'insensitive'},
            },
            gender: search?.gender ? {equals: search?.gender} : {},
            isFlatSalary: search?.isFlatSalary === 1 ? true : (search?.isFlatSalary === 0 ? false : undefined),
          },
          include: {
            position: {include: {department: {include: {branch: true}}}},
            ward: {
              include: {
                district: {
                  include: {
                    province: {
                      include: {
                        nation: true
                      }
                    }
                  }
                }
              }
            },
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
          relatives: {
            include: {
              ward: {
                include: {
                  district: {
                    include: {
                      province: {
                        include: {
                          nation: true
                        }
                      }
                    }
                  }
                }
              },
            }
          },
          banks: true,
          position: {include: {department: {include: {branch: true}}}},
          ward: {
            include: {
              district: {
                include: {
                  province: {
                    include: {
                      nation: true
                    }
                  }
                }
              }
            }
          },
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
