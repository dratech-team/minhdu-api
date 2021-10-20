import {BadRequestException, Injectable} from "@nestjs/common";
import {catchError} from "rxjs/operators";
import {PrismaService} from "src/prisma.service";
import {CreateBasicTemplateDto} from "./dto/create-basic-template.dto";
import {UpdateBasicTemplateDto} from "./dto/update-basic-template.dto";
import {SalaryType} from "@prisma/client";

@Injectable()
export class BasicTemplateService {
  constructor(private readonly prisma: PrismaService) {
  }

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

  async findAll(type: SalaryType) {
    try {
      const [total, data] = await Promise.all([
        this.prisma.basicTemplate.count(),
        this.prisma.basicTemplate.findMany({
          where: {
            type: {in: type || undefined},
          },
          orderBy: {
            price: "desc"
          }
        }),
      ]);
      return {total, data};
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.basicTemplate.findUnique({where: {id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async update(id: number, updates: UpdateBasicTemplateDto) {
    try {
      return await this.prisma.basicTemplate.update({
        where: {id},
        data: updates,
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async remove(id: number) {
    return await this.prisma.basicTemplate.delete({where: {id}});
  }
}
