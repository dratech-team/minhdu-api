import {PrismaService} from "../../../prisma.service";
import {CreateProvinceDto} from "./dto/create-province.dto";
import {Province} from "@prisma/client";
import {BadRequestException, Injectable} from "@nestjs/common";

@Injectable()
export class ProvinceRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateProvinceDto): Promise<Province> {
    try {
      return await this.prisma.province.create({data: body});
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err);
    }
  }

  async findAll(): Promise<Province[]> {
    return await this.prisma.province.findMany();
  }
}
