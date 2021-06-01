import {BadRequestException, ConflictException, Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "../../../prisma.service";
import {CreateEmployeeDto} from "./dto/create-employee.dto";
import {UpdateEmployeeDto} from "./dto/update-employee.dto";

@Injectable()
export class EmployeeRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateEmployeeDto) {
    try {
      return await this.prisma.employee.create({
        data: {
          id: body.id,
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
      if (err?.code == "P2025") {
        throw new NotFoundException(`Không tìm thấy id ${body?.branchId} hoặc ${body?.departmentId} hoặc ${body?.positionId}. Chi tiết: ${err?.meta?.cause}`);
      } else if (err?.code == "P2002") {
        throw new ConflictException(`CMND không được giống nhau. Vui lòng kiểm tra lại. Chi tiết: ${err}`);
      } else if (err?.code == "P2014") {
        throw new BadRequestException(`Chi nhánh ${body.branchId} không tồn tại phòng ban ${body.departmentId} hoặc phòng ban ${body.departmentId} không tồn tại chức vụ ${body.positionId}. Vui lòng kiểm tra lại. Chi tiết: ${err?.meta}`);
      } else {
        throw new BadRequestException(err);
      }
    }
  }

  async count(): Promise<number> {
    return await this.prisma.employee.count();
  }

  async findAll(branchId: number, skip: number, take: number, search?: string) {
    const where = {
      leftAt: null,
      branchId,
      id: {startsWith: search}
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

  async findMany(branchId: number) {
    return  await this.prisma.employee.findMany({
      where: {branchId},
      include: {payrolls: true}
    });
  }

  async findOne(id: string) {
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

  async update(id: string, updates: UpdateEmployeeDto) {
    return await this.prisma.employee.update({where: {id: id}, data: updates})
      .catch((e) => new BadRequestException(e));
  }

  async remove(id: string) {
    this.prisma.employee.delete({where: {id: id}}).catch((e) => {
      throw new BadRequestException(e);
    });
  }

  updateQrCode(id: string, qrCode: string): void {
    this.prisma.employee.update({
      where: {id},
      data: {qrCode}
    }).then();
  }
}
