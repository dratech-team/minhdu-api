import {BadRequestException, Injectable} from "@nestjs/common";
import {PrismaService} from "src/prisma.service";
import {CreateImportExportDto} from "./dto/create-import-export.dto";
import {UpdateImportExportDto} from "./dto/update-import-export.dto";
import {SearchImportExportDto} from "./dto/search-import-export.dto";

@Injectable()
export class ImportExportService {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateImportExportDto) {
    return "This action adds a new importExport";
  }

  async findAll(search: SearchImportExportDto) {
    try {
      const [total, data] = await Promise.all([
        this.prisma.importExport.count({
          where: {
            type: search?.type ? {in: search?.type} : {},
            product: search?.product ? {name: {contains: search?.product}} : {},
          }
        }),
        this.prisma.importExport.findMany({
          take: search?.take,
          skip: search?.skip,
          where: {
            type: search?.type ? {in: search?.type} : {},
            product: search?.product ? {name: {contains: search?.product}} : {},
          },
          include: {
            product: true
          }
        })
      ]);
      return {total, data};
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findOne(id: number) {
    return `This action returns a #${id} importExport`;
  }

  async update(id: number, updates: UpdateImportExportDto) {
    return `This action updates a #${id} importExport`;
  }

  async remove(id: number) {
    return `This action removes a #${id} importExport`;
  }
}
