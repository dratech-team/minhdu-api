import {BadRequestException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../../../prisma.service";
import {CreateRemoteDto, RemoveManyRemoteDto, UpdateRemoteDto} from "./dto";
import {CreateManyRemoteDto} from "./dto/create-many-remote.dto";
import {UpdateOvertimeDto} from "../overtime/dto/update-overtime.dto";

@Injectable()
export class RemoteRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateManyRemoteDto) {
    try {
      return 'Chưa làm';
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
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

  async count() {
    try {
      return await this.prisma.remoteSalary.count();
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

  async update(id: number, body: UpdateOvertimeDto) {
    try {
      return `Chưa làm`;
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async updateMany(ids: number[], body: UpdateRemoteDto) {
    try {
      return await this.prisma.remoteSalary.updateMany({where: {id: {in: ids}}, data: body});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async remove(id: number) {
    try {
      return `Chưa làm`;
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
