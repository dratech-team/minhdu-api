import {BadRequestException, ConflictException, Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "../../../prisma.service";
import {CreateDepartmentDto} from "./dto/create-department.dto";
import {Department} from "@prisma/client";
import {UpdateDepartmentDto} from "./dto/update-department.dto";

@Injectable()
export class DepartmentRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateDepartmentDto): Promise<Department> {
    return this.prisma.department.create({data: body}).catch(err => {
      console.error(err);
      if (err?.code == "P2025") {
        throw new NotFoundException(`Không tìm thấy chi nhánh ${body?.branchId}. Chi tiết: ${err?.meta?.cause}`);
      } else if (err?.code == "P2002") {
        throw new ConflictException(`Tên có tên bị trùng. Vui lòng kiểm tra lại. Chi tiết ${err}`);
      } else {
        throw new BadRequestException(err);
      }
    });
  }

  async findAll(): Promise<any> {
    try {
      return await this.prisma.department.findMany({include: {positions: true}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findOne(id: number): Promise<Department> {
    return this.prisma.department.findUnique({
      where: {id},
      include: {branch: true}
    }).catch(err => {
      console.error(err);
      throw new BadRequestException(err);
    });
  }

  async update(id: number, updates: UpdateDepartmentDto): Promise<Department> {
    return this.prisma.department.update({
      where: {id: id},
      data: {name: updates.name}
    }).catch(err => {
      console.error(err);
      throw new BadRequestException(err);
    });
  }

  async remove(id: number) {
    try {
      return await this.prisma.department.delete({where: {id: id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
