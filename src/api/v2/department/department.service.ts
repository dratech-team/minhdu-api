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
    const branches = body.branchIds?.map(branch => ({
      id: branch
    }));
    try {
      return await this.prisma.department.create({
        data: {
          name: body.name,
          branches: {connect: branches}
        }
      });
    } catch (e) {
      if (e?.code == "P2025") {
        throw new NotFoundException(`Không tìm thấy chi nhánh ${body?.branchIds?.join(" hoặc ")}. Chi tiết: ${e?.meta?.cause}`);
      } else if (e?.code == "P2002") {
        throw new ConflictException('Tên phòng ban không được phép trùng nhau. Vui lòng thử lại');
      } else {
        throw new BadRequestException(e);
      }
    }
  }

  async findAll(skip: number, take: number, branchId: number, search?: string): Promise<PaginateResult> {
    try {
      const [count, data] = await Promise.all([
        this.prisma.department.count({where: {branches: {some: {id: branchId}}}}),

        this.prisma.department.findMany({
          skip: skip,
          take: take,
          where: {branches: {some: {id: branchId}}, name: search},
        }),
      ]);
      return {
        data,
        statusCode: 200,
        page: (skip / take) + 1,
        total: count,
      };
    } catch (e) {
      throw new InternalServerErrorException(`Các tham số skip, take, id là bắt buộc. Vui lòng kiểm tra lại bạn đã truyền đủ 3 tham số chưa.?`);
    }
  }

  // async findOne(id: number): Promise<Department> {
  //   const department = await this.prisma.department.findMany({
  //     where: {branches: {some: {id: id}}, },
  //   });
  // }

  async update(id: number, updates: UpdateDepartmentDto): Promise<Department> {
    return await this.prisma.department.update({where: {id: id}, data: updates}).catch((e) => {
      throw new BadRequestException(e);
    });
  }

  async remove(id: number): Promise<void> {
    await this.prisma.department.delete({where: {id: id}}).catch((e) => {
      throw new BadRequestException(e);
    });
  }
}
