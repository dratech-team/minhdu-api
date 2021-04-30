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

    const positions = body.positions?.map(position => ({
      position: {
        connectOrCreate: {
          where: {name: position},
          create: {name: position}
        },
      }
    }));
    try {
      return await this.prisma.department.create({
        data: {
          name: body.department,
          branches: {connect: branches},
          // @ts-ignore
          positions: {create: positions}
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
      // @ts-ignore
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
    const positions = updates.positionIds?.map((positionId) => ({
      id: positionId
    }));

    const positions1 = updates.positionIds?.map(position => ({
      position: {
        connectOrCreate: {
          where: {id: position},
          create: {id: position}
        },
      }
    }));
    // data: {
    //   // @ts-ignore
    //   name: updates.department, positions: {create: positions1},
    // },//connect: updates.positionIds.map((position) => ({id: position})), create: updates.positionIds.map((position) => ({id: position}))
    try {
      return await this.prisma.department.update({
        where: {id: id},
        data: {
          name: updates.department,
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
