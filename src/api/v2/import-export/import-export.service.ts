import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { CreateImportExportDto } from "./dto/create-import-export.dto";
import { UpdateImportExportDto } from "./dto/update-import-export.dto";

@Injectable()
export class ImportExportService {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: CreateImportExportDto) {
    return "This action adds a new importExport";
  }

  async findAll() {
    return `This action returns all importExport`;
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
