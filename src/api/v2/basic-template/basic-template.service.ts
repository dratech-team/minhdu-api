import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { CreateBasicTemplateDto } from "./dto/create-basic-template.dto";
import { UpdateBasicTemplateDto } from "./dto/update-basic-template.dto";

@Injectable()
export class BasicTemplateService {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: CreateBasicTemplateDto) {
    try {
      return await this.prisma.basicTemplate.create({
        data: body,
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll() {
    try {
      return await this.prisma.basicTemplate.findMany();
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.basicTemplate.findUnique({ where: { id } });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async update(id: number, updateBasicTemplateDto: UpdateBasicTemplateDto) {
    return `This action updates a #${id} basicTemplate`;
  }

  async remove(id: number) {
    return `This action removes a #${id} basicTemplate`;
  }
}
