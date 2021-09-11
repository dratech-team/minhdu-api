import {PrismaService} from "../../../prisma.service";
import {CreateProvinceDto} from "./dto/create-province.dto";
import {Province, Ward} from "@prisma/client";
import {BadRequestException, Injectable} from "@nestjs/common";

@Injectable()
export class ProvinceRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateProvinceDto): Promise<Province> {
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
            wards: true
          }
        }
      }
    });
  }
}
