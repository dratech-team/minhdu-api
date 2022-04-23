import {BadRequestException, Injectable} from "@nestjs/common";
import {RemoteSalary} from "@prisma/client";
import {PrismaService} from "../../../../prisma.service";
import {UpdateRemoteDto} from "./dto/update-remote.dto";

@Injectable()
export class RemoteRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: Omit<RemoteSalary, "id">) {
    try {
      return await this.prisma.remoteSalary.create({data: body});
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

  async update(id: number, body: UpdateRemoteDto) {
    try {
      return await this.prisma.remoteSalary.update({where: {id}, data: body});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.remoteSalary.delete({where: {id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
