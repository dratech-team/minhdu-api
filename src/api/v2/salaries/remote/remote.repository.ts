import {BadRequestException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../../../prisma.service";
import {RemoteEntity} from "./entities/remote.entity";
import {CreateRemoteDto, RemoveManyRemoteDto} from "./dto";

@Injectable()
export class RemoteRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async createMany(body: CreateRemoteDto[]) {
    try {
      return await this.prisma.remoteSalary.createMany({data: body});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll() {
    try {
      return await this.prisma.remoteSalary.findMany();
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.remoteSalary.findUnique({where: {id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async updateMany(ids: number[], body: RemoteEntity) {
    try {
      return await this.prisma.remoteSalary.updateMany({where: {id: {in: ids}}, data: body});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async removeMany(body: RemoveManyRemoteDto) {
    try {
      return await this.prisma.remoteSalary.deleteMany({where: {id: {in: body.salaryIds}}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
