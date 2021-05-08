import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import {CreateBranchDto} from './dto/create-branch.dto';
import {UpdateBranchDto} from './dto/update-branch.dto';
import {PrismaService} from "../../../prisma.service";
import {Branch} from '@prisma/client';
import {PaginateResult} from "../../../common/interfaces/paginate.interface";
import {generateId} from "../../../common/utils/generate-id.utils";

@Injectable()
export class BranchService {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateBranchDto): Promise<Branch> {
    const departments = body.departmentIds?.map((department) => ({
      id: department
    }));

    const id = generateId(body.name);

    try {
      return await this.prisma.branch.create({
        data: {
          id: id,
          name: body.name,
          area: {connect: {id: body.areaId}},
          departments: {connect: departments}
        }
      });
    } catch (e) {
      if (e?.code == "P2025") {
        throw new NotFoundException(`Không tìm thấy khu vực ${body?.areaId} hoặc các phòng ban ${body?.departmentIds?.join(", ")}. Vui lòng thử lại. Chi tiết: ${e?.meta?.cause}`);
      } else if (e?.code == "P2002") {
        throw new ConflictException('Tên chi nhánh không được phép trùng nhau. Vui lòng thử lại');
      } else {
        throw new BadRequestException(e);
      }
    }
  }

  async findAll(): Promise<any> {
    try {
      return await this.prisma.branch.findMany({
        include: {departments: {select: {department: true}}}
      });
    } catch (e) {
      throw new InternalServerErrorException(`Các tham số skip, take, id là bắt buộc. Vui lòng kiểm tra lại bạn đã truyền đủ 3 tham số chưa.?`);
    }

  }

  findOne(id: string) {
    return this.prisma.branch.findUnique({where: {id: id}});
  }

  async update(id: string, updates: UpdateBranchDto) {
    return await this.prisma.branch.update({where: {id: id}, data: updates}).catch((e) => new BadRequestException(e));
  }

  async remove(id: string): Promise<void> {
    await this.prisma.branch.delete({where: {id: id}}).catch((e) => {
      throw new BadRequestException(e);
    });
  }
}
