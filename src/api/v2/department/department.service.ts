import {BadRequestException, ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {CreateDepartmentDto} from './dto/create-department.dto';
import {UpdateDepartmentDto} from './dto/update-department.dto';
import {PrismaService} from "../../../prisma.service";
import {Department} from '@prisma/client';

@Injectable()
export class DepartmentService {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateDepartmentDto): Promise<Department> {
    body.color = Math.floor(Math.random() * 16777215).toString(16);

    try {
      return await this.prisma.department.create({data: body});
    } catch (e) {
      console.log(e);
      if (e?.code == "P2025") {
        throw new NotFoundException(`Không tìm thấy chi nhánh ${body?.branchId}. Chi tiết: ${e?.meta?.cause}`);
      } else if (e?.code == "P2002") {
        throw new ConflictException(`Tên có tên bị trùng. Vui lòng kiểm tra lại. Chi tiết ${e}`);
      } else {
        throw new BadRequestException(e);
      }
    }
  }

  async findAll(): Promise<any> {
    let data = [];
    try {
      const departments = await this.prisma.department.findMany({include: {positions: true}});
      departments.map(department => {
        data.push({
          id: department.id,
          name: department.name,
          color: department.color,
          branchId: department.branchId,
          positionIds: department.positions.map(position => position.id)
        });
      });
      return data;
    } catch (e) {
      throw new BadRequestException(`Các tham số skip, take, id là bắt buộc. Vui lòng kiểm tra lại bạn đã truyền đủ 3 tham số chưa.?. Chi tiết: ${e}`);
    }
  }

  async findOne(id: number): Promise<Department> {
    return await this.prisma.department.findUnique({
      where: {id},
      include: {branch: true}
    });
  }

  async update(id: number, updates: UpdateDepartmentDto): Promise<Department> {
    try {
      return await this.prisma.department.update({
        where: {id: id},
        data: {name: updates.name}
      });
    } catch (e) {
      console.log(e);
      throw new BadRequestException(e);
    }
  }

  async remove(id: number): Promise<void> {
    await this.prisma.department.delete({where: {id: id}}).catch((e) => {
      throw new BadRequestException(e);
    });
  }
}
