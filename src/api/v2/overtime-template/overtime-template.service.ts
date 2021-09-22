import {
  BadRequestException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { PrismaService } from "../../../prisma.service";
import { CreateOvertimeTemplateDto } from "./dto/create-overtime-template.dto";
import { SearchOvertimeTemplateDto } from "./dto/search-overtime-template.dto";
import { UpdateOvertimeTemplateDto } from "./dto/update-overtime-template.dto";

@Injectable()
export class OvertimeTemplateService {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: CreateOvertimeTemplateDto) {
    try {
      return await this.prisma.overtimeTemplate.create({ data: body });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll(
    take: number,
    skip: number,
    search: Partial<SearchOvertimeTemplateDto>
  ) {
    try {
      const [total, data] = await Promise.all([
        this.prisma.overtimeTemplate.count({
          where: {
            title: { startsWith: search?.title, mode: "insensitive" },
            price: search?.price ? { in: search?.price } : {},
            unit: search?.unit || undefined,
          },
        }),
        this.prisma.overtimeTemplate.findMany({
          take: take || undefined,
          skip: skip || undefined,
          where: {
            title: { startsWith: search?.title, mode: "insensitive" },
            price: search?.price ? { in: search?.price } : {},
            unit: search?.unit || undefined,
          },
          include: {
            position: {
              include: { department: { include: { branch: true } } },
            },
          },
        }),
      ]);
      return { total, data };
    } catch (err) {
      console.error(err);
      throw new NotFoundException(err);
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.overtimeTemplate.findUnique({
        where: { id },
        include: {
          position: {
            include: {
              department: {
                include: {
                  branch: true,
                },
              },
            },
          },
        },
      });
    } catch (err) {
      console.error(err);
      throw new NotFoundException(err);
    }
  }

  async update(id: number, updates: UpdateOvertimeTemplateDto) {
    try {
      return await this.prisma.overtimeTemplate.update({
        where: { id },
        data: updates,
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.overtimeTemplate.delete({ where: { id } });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
