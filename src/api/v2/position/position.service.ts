import {BadRequestException, ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {Position} from '@prisma/client';
import {CreatePositionDto} from './dto/create-position.dto';
import {UpdatePositionDto} from './dto/update-position.dto';
import {PrismaService} from "../../../prisma.service";

@Injectable()
export class PositionService {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreatePositionDto): Promise<Position> {
    try {
      return await this.prisma.position.create({data: body});
    } catch (e) {
      console.log(e);
      if (e?.code == "P2025") {
        throw new NotFoundException(`Không tìm thấy phòng ban ${body?.departmentId}. Chi tiết: ${e?.meta?.cause}`);
      } else if (e?.code == "P2002") {
        throw new ConflictException('Tên chức vụ không được phép trùng nhau. Vui lòng thử lại');
      } else {
        throw new BadRequestException(e);
      }
    }
  }

  async findAll(): Promise<any> {
    try {
      return await this.prisma.position.findMany();
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.position.findUnique({where: {id: id}});
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }

  }

  update(id: number, updates: UpdatePositionDto) {
    try {
      return this.prisma.position.update({where: {id: id}, data: updates});
    } catch (e) {
      throw new BadRequestException(e);
    }

  }

  async remove(id: number) {
    try {
      return await this.prisma.position.delete({where: {id: id}});
    } catch (e) {
      console.error(e);
      throw new BadRequestException(`Chức vụ này đang được liên kết với nhiều nhân viên. Thao tác này sẽ xảy ra các trường hợp ngoài ý muốn. Vui lòng liên hệ admin. Chi tiết: ${e}`);
    }
  }
}
