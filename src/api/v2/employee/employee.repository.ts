import {
  BadRequestException,
  ConflictException,
  Injectable,
} from "@nestjs/common";
import { ProfileEntity } from "../../../common/entities/profile.entity";
import { PrismaService } from "../../../prisma.service";
import { searchName } from "../../../utils/search-name.util";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { SearchEmployeeDto } from "./dto/search-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";

@Injectable()
export class EmployeeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: CreateEmployeeDto) {
    try {
      const position = await this.prisma.position.findUnique({
        where: { id: body.positionId },
      });

      // Nếu tạo nhân viên có workday thuộc position này nhưng khác ngày công chuẩn thì cập nhật lại ngày công chuẩn cho position đó
      if (position.name && body.workday !== position.workday) {
        this.prisma.position.update({
          where: { id: body.positionId },
          data: { workday: body.workday },
        });
      }
      return await this.prisma.employee.create({
        data: {
          firstName: body.firstName,
          lastName: body.lastName,
          gender: body.gender,
          phone: body.phone,
          workPhone: body.workPhone,
          birthday: body.birthday,
          birthplace: body.birthplace,
          identify: body.identify,
          idCardAt: body.idCardAt,
          issuedBy: body.issuedBy,
          workday: body.workday,
          ward: { connect: { id: body.wardId } },
          address: body.address,
          email: body.email,
          religion: body.religion,
          mst: body.mst,
          createdAt: body.createdAt,
          workedAt: body.workedAt,
          isFlatSalary: body.isFlatSalary,
          position: { connect: { id: body.positionId } },
          note: body.note,
          branch: { connect: { id: body.branchId } },
          recipeType: body.recipeType,
          contracts: body.contract?.createdAt
            ? {
                create: {
                  createdAt: body.contract.createdAt,
                  expiredAt: body.contract.expiredAt,
                  position: position.name,
                },
              }
            : {},
        },
        include: {
          position: { include: { branches: true } },
        },
      });
    } catch (err) {
      console.error(err);
      if (err?.response?.code === "P2002") {
        throw new ConflictException(
          "Nhân viên đã nghỉ việc. Hồ sơ nhân viên đã có trên hệ thống. Vui lòng liên hệ admin để khôi phục tài khoản",
          err
        );
      } else {
        throw new BadRequestException(
          "Thêm nhân viên thất bại. Bạn đã tạo mới chức vụ hoặc đơn vị mới chưa. Vui lòng kiểm tra lại. ",
          err
        );
      }
    }
  }

  async count(): Promise<number> {
    return await this.prisma.employee.count();
  }

  async findAll(
    profile: ProfileEntity,
    skip: number,
    take: number,
    search: Partial<SearchEmployeeDto>
  ) {
    try {
      const name = searchName(search?.name);

      const template = search?.templateId
        ? await this.prisma.overtimeTemplate.findUnique({
            where: { id: search?.templateId },
            include: { positions: true },
          })
        : null;
      const positionIds = template?.positions?.map((position) => position.id);

      const [total, data] = await Promise.all([
        this.prisma.employee.count({
          where: {
            leftAt: null,
            position: {
              name: { startsWith: search?.position, mode: "insensitive" },
            },
            branch: {name: {startsWith: search?.branch, mode: "insensitive"}},
            positionId: positionIds?.length ? {in: positionIds || undefined} : {},
            AND: {
              firstName: { startsWith: name?.firstName, mode: "insensitive" },
              lastName: { startsWith: name?.lastName, mode: "insensitive" },
            },
            gender: search?.gender ? { equals: search?.gender } : {},
            isFlatSalary: search?.isFlatSalary,
            createdAt: search?.createdAt,
            workedAt: search?.workedAt,
          },
        }),
        this.prisma.employee.findMany({
          skip: skip || undefined,
          take: take || undefined,
          where: {
            leftAt: null,
            position: {
              name: { startsWith: search?.position, mode: "insensitive" },
            },
            branch: {
              name: { startsWith: search?.branch, mode: "insensitive" },
            },
            positionId: positionIds?.length ? {in: positionIds} : {},
            AND: {
              firstName: { startsWith: name?.firstName, mode: "insensitive" },
              lastName: { startsWith: name?.lastName, mode: "insensitive" },
            },
            gender: search?.gender ? { equals: search?.gender } : {},
            isFlatSalary: search?.isFlatSalary,
            createdAt: search?.createdAt,
            workedAt: search?.workedAt,
          },
          include: {
            position: true,
            branch: true,
            ward: {
              include: {
                district: {
                  include: { province: { include: { nation: true } } },
                },
              },
            },
          },
        }),
      ]);
      return { total, data };
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  async findBy(query: any) {
    return await this.prisma.employee.findMany({
      where: query,
      include: { payrolls: true },
    });
  }

  async findFirst(query: any) {
    return await this.prisma.employee.findFirst({
      where: query,
      include: { payrolls: true },
    });
  }

  async findOne(id: number) {
    try {
      return await this.prisma.employee.findUnique({
        where: { id: id },
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
                          nation: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          banks: true,
          position: true,
          branch: true,
          ward: {
            include: {
              district: {
                include: {
                  province: {
                    include: {
                      nation: true,
                    },
                  },
                },
              },
            },
          },
          payrolls: true,
          historySalaries: true,
          workHistories: {
            include: {
              position: true,
              branch: true,
            },
          },
        },
      });
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  async update(id: number, updates: UpdateEmployeeDto) {
    try {
      return await this.prisma.employee.update({
        where: { id: id },
        data: {
          firstName: updates.firstName,
          lastName: updates.lastName,
          gender: updates.gender,
          phone: updates.phone,
          workPhone: updates.workPhone,
          birthday: updates.birthday,
          birthplace: updates.birthplace,
          identify: updates.identify,
          idCardAt: updates.idCardAt,
          issuedBy: updates.issuedBy,
          ward: { connect: { id: updates.wardId } },
          position: { connect: { id: updates.positionId } },
          branch: { connect: { id: updates.branchId } },
          address: updates.address,
          religion: updates.religion,
          workday: updates.workday,
          mst: updates.mst,
          email: updates.email,
          zalo: updates.zalo,
          facebook: updates.facebook,
          avt: updates.avt,
          ethnicity: updates.ethnicity,
          createdAt: updates.createdAt,
          workedAt: updates.workedAt,
          isFlatSalary: updates.isFlatSalary,
          note: updates.note,
        },
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  /* Nghỉ việc */
  async remove(id: number) {
    try {
      await this.prisma.employee.update({
        where: { id },
        data: {
          leftAt: new Date(),
        },
      });
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  // updateQrCode(employeeId: number, qrCode: string) {
  //   this.prisma.employee.update({
  //     where: {id: employeeId},
  //     data: {qrCode}
  //   }).then();
  // }
}
