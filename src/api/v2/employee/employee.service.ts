import {BadRequestException, ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {CreateEmployeeDto} from './dto/create-employee.dto';
import {UpdateEmployeeDto} from './dto/update-employee.dto';
import {PrismaService} from "../../../prisma.service";

@Injectable()
export class EmployeeService {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateEmployeeDto) {
    try {
      return await this.prisma.employee.create({
        data: {
          id: body.id,
          code: await this.generateEmployeeCode(body),
          name: body.name,
          address: body.address,
          basicSalary: {
            create: body.basicSalary,
          },
          workedAt: new Date(body.workedAt).toISOString(),
          branch: {connect: {id: body.branchId}},
          department: {connect: {id: body.departmentId}},
          position: {connect: {id: body.positionId}},
          phone: body.phone,
          birthday: new Date(body.birthday).toISOString(),
          gender: body.gender,
          note: body.note,
        }
      });
    } catch (e) {
      console.log(e);
      if (e?.code == "P2025") {
        throw new NotFoundException(`Không tìm thấy id ${body?.branchId} hoặc ${body?.departmentId} hoặc ${body?.positionId}. Chi tiết: ${e?.meta?.cause}`);
      } else if (e?.code == "P2002") {
        throw new ConflictException(`CMND không được giống nhau. Vui lòng kiểm tra lại. Chi tiết: ${e}`);
      } else if (e?.code == "P2014") {
        throw new BadRequestException(`Chi nhánh ${body.branchId} không tồn tại phòng ban ${body.departmentId} hoặc phòng ban ${body.departmentId} không tồn tại chức vụ ${body.positionId}. Vui lòng kiểm tra lại. Chi tiết: ${e?.meta}`);
      } else {
        throw new BadRequestException(e);
      }
    }

  }

  findAll() {
    return `This action returns all employee`;
  }

  findOne(id: number) {
    return `This action returns a #${id} employee`;
  }

  update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    return `This action updates a #${id} employee`;
  }

  remove(id: number) {
    return `This action removes a #${id} employee`;
  }

  async generateEmployeeCode(body: CreateEmployeeDto): Promise<string> {
    const branch = await this.prisma.branch.findUnique({where: {id: body.branchId}});
    const count = await this.prisma.employee.count();
    let gen: string;
    if (count < 10) {
      gen = "000";
    } else if (count < 100) {
      gen = "00";
    } else if (count < 1000) {
      gen = "0";
    }

    return `${branch.id}${gen}${count + 1}`;
  }
}
