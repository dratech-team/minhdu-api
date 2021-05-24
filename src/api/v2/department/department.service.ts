import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import {CreateDepartmentDto} from './dto/create-department.dto';
import {UpdateDepartmentDto} from './dto/update-department.dto';
import {PrismaService} from "../../../prisma.service";
import {Department} from '@prisma/client';

@Injectable()
export class DepartmentService {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateDepartmentDto): Promise<Department> {
    try {
      const branches = body.branchIds?.map(branchId => ({
        id: branchId
      }));

      const data = await this.prisma.department.findUnique({
        where: {name: body.name}
      });

      if (data) {
        return this.prisma.department.update({
          where: {id: data.id},
          data: {
            branches: {connect: branches}
          }
        });
      } else {
        body.color = Math.floor(Math.random() * 16777215).toString(16);
        return await this.prisma.department.create({
          data: {
            name: body.name,
            color: body.color,
            branches: {connect: branches}
          }
        });
      }
    } catch (e) {
      console.log(e);
      if (e?.code == "P2025") {
        throw new NotFoundException(`Không tìm thấy chi nhánh ${body?.branchIds?.join(" hoặc ")}. Chi tiết: ${e?.meta?.cause}`);
      } else if (e?.code == "P2002") {
        throw new ConflictException(`Tên có tên bị trùng. Vui lòng kiểm tra lại. Chi tiết ${e}`);
      } else {
        throw new BadRequestException(e);
      }
    }
  }

  async findAll(): Promise<any> {
    let departments = [];
    try {
      const res = await this.prisma.department.findMany({
        select: {
          id: true,
          name: true,
          color: true,
          positions: {select: {id: true, workday: true}}
        }
      });
      res.map(department => departments.push({
        id: department.id,
        name: department.name,
        color: department.color,
        positionIds: department.positions.map(position => position.id),
      }));
      return departments;
    } catch (e) {
      throw new InternalServerErrorException(`Các tham số skip, take, id là bắt buộc. Vui lòng kiểm tra lại bạn đã truyền đủ 3 tham số chưa.?. Chi tiết: ${e}`);
    }
  }

  // async findOne(id: number): Promise<Department> {
  //   const department = await this.prisma.department.findMany({
  //     where: {branches: {some: {id: id}}, },
  //   });
  // }

  async update(id: number, updates: UpdateDepartmentDto): Promise<Department> {
    try {
      return await this.prisma.department.update({
        where: {id: id},
        data: {
          name: updates.name,
          color: updates.color,
          // branches: {connect: updates.branchIds.map((branchId) => {id: branchId})},
        }
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
