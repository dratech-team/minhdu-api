import {District, Province} from "@prisma/client";
import {PrismaService} from "../../../prisma.service";
import {CreateDistrictDto} from "./dto/create-district.dto";
import {BadRequestException, Injectable} from "@nestjs/common";

@Injectable()
export class DistrictRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateDistrictDto): Promise<District> {
    try {
      return await this.prisma.district.create({data: body});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findOne(id: number): Promise<District> {
    return await this.prisma.district.findUnique({where: {id}});
  }

  async findAll(): Promise<District[]> {
    return this.prisma.district.findMany({
      include: {
        wards: true
      }
    });
  }
}
