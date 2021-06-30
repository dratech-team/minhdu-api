import {Ward} from "@prisma/client";
import {PrismaService} from "../../../prisma.service";
import {CreateWardDto} from "./dto/create-ward.dto";
import {BadRequestException, Injectable} from "@nestjs/common";

@Injectable()
export class WardRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateWardDto): Promise<Ward> {
    try {
      return await this.prisma.ward.create({data: body});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll(): Promise<Ward[]> {
    return this.prisma.ward.findMany();
  }
}
