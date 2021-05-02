import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import {Position} from '@prisma/client';
import {CreatePositionDto} from './dto/create-position.dto';
import {UpdatePositionDto} from './dto/update-position.dto';
import {PrismaService} from "../../../prisma.service";
import {PaginateResult} from "../../../common/interfaces/paginate.interface";

@Injectable()
export class PositionService {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreatePositionDto): Promise<Position> {
    try {
      return await this.prisma.position.create({
        // @ts-ignore
        data: {
          name: body.name,
          departments: {
            create: body.departmentIds?.map((departmentId => ({
              department: {
                connect: {id: departmentId},
              },
              workday: body.workday,
            })))
          }
        }
      });
    } catch (e) {
      console.log(e);
      if (e?.code == "P2025") {
        throw new NotFoundException(`Không tìm thấy phòng ban ${body?.departmentIds?.join(" hoặc ")}. Chi tiết: ${e?.meta?.cause}`);
      } else if (e?.code == "P2002") {
        throw new ConflictException('Tên chức vụ không được phép trùng nhau. Vui lòng thử lại');
      } else {
        throw new BadRequestException(e);
      }
    }
  }

  async findAll(skip: number, take: number): Promise<PaginateResult> {
    try {
      const [count, data] = await Promise.all([
        this.prisma.position.count(),
        this.prisma.position.findMany({
          skip: skip,
          take: take
        }),
      ]);
      return {
        data,
        statusCode: 200,
        page: (skip / take) + 1,
        total: count,
      };
    } catch (e) {
      throw new InternalServerErrorException(`Các tham số skip, take là bắt buộc. Vui lòng kiểm tra lại bạn đã truyền đủ 3 tham số chưa.? Chi tiết ${e}`);
    }
  }

  async findOne(id: number) {
    return this.prisma.position.findUnique({where: {id: id}});
  }

  update(id: number, updates: UpdatePositionDto) {
    try {
      // this.prisma.position.update({where: {id: id}, data: updates});
      return `This action updates a #${id} position`;
    } catch (e) {
      throw new BadRequestException(e);
    }

  }

  remove(id: number) {
    return `This action removes a #${id} position`;
  }
}
