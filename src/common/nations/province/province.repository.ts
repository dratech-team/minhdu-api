import {HttpService} from "@nestjs/axios";
import {BadRequestException, Injectable} from "@nestjs/common";
import {Province} from "@prisma/client";
import {PrismaService} from "../../../prisma.service";
import {CreateProvinceDto} from "./dto/create-province.dto";

@Injectable()
export class ProvinceRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly http: HttpService
  ) {
  }

  async create(body: CreateProvinceDto) {
    try {
      return await this.prisma.province.create({data: body});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findOne(id: number): Promise<Province> {
    return await this.prisma.province.findUnique({where: {id}});
  }

  async findAll(): Promise<Province[]> {
    return await this.prisma.province.findMany({
      include: {
        districts: {
          include: {
            wards: true,
          },
        },
      },
    });
  }
}
