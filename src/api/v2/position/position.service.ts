import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { Position } from '@prisma/client';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { PrismaService } from "../../../prisma.service";
import { PaginateResult } from "../../../common/interfaces/paginate.interface";

@Injectable()
export class PositionService {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreatePositionDto): Promise<Position> {
    try {
      return await this.prisma.position.create({
        data: {
          name: body.name,
          departments: {
            create: body.departmentIds?.map((departmentId => ({
              department: {
                connect: { id: departmentId },
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

  async findAll(): Promise<Position[]> {
    try {
      return await this.prisma.position.findMany();
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.position.findUnique({ where: { id: id } });
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }

  }

  update(id: number, updates: UpdatePositionDto) {
    try {
      return this.prisma.position.update({ where: { id: id }, data: updates });
    } catch (e) {
      throw new BadRequestException(e);
    }

  }

  remove(id: number) {
    return this.prisma.position.delete({ where: { id: id } });
  }
}
