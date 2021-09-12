import {PrismaService} from "../../../prisma.service";
import {CreateProvinceDto} from "./dto/create-province.dto";
import {Province} from "@prisma/client";
import {BadRequestException, Injectable} from "@nestjs/common";
import {map} from "rxjs/operators";
import {HttpService} from "@nestjs/axios";

@Injectable()
export class ProvinceRepository {
  constructor(private readonly prisma: PrismaService, private readonly http: HttpService) {
  }

  async create(body: CreateProvinceDto): Promise<Province> {
    try {
      return await this.prisma.province.create({
        data: body,
      });
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
