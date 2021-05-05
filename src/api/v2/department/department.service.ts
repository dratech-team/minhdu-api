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
import {PaginateResult} from "../../../common/interfaces/paginate.interface";

@Injectable()
export class DepartmentService {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateDepartmentDto): Promise<Department> {
    const branches = body.branchIds?.map(branchId => ({
      branch: {
        connect: {id: branchId}
      }
    }));
    try {
      return await this.prisma.department.create({
        data: {
          name: body.department,
          color: body.color,
          branches: {
            create: branches
          },
        }
      });
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

  async findAll(skip: number, take: number, id?: number, search?: string): Promise<PaginateResult> {
    try {
      const [count, data] = await Promise.all([
        id
          ? this.prisma.department.count({where: {branches: {some: {id: id}}}})
          : this.prisma.department.count(),

        id
          ? this.prisma.department.findMany({
            skip: skip,
            take: take,
            where: {branches: {some: {id: id}}, name: search}
          })
          : this.prisma.department.findMany({
            skip: skip,
            take: take,
            include: {
              positions: {
                // @ts-ignore
                select: {position: true}
              },
            }
          }),
      ]);
      return {
        data,
        statusCode: 200,
        page: (skip / take) + 1,
        total: count,
      };
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
          name: updates.department,
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
