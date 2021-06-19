import {Injectable} from "@nestjs/common";
import {PrismaService} from "../../../prisma.service";
import {InterfaceRepository} from "../../../common/repository/interface.repository";
import {Relative} from '@prisma/client';
import {CreateRelativeDto} from "./dto/create-relative.dto";

@Injectable()
export class RelativeRepository implements InterfaceRepository<Relative> {
  constructor(private readonly prisma: PrismaService) {
  }

  async count(): Promise<number> {
    return await this.prisma.relative.count();
  }

  create(body: CreateRelativeDto): Promise<Relative> {
    return this.prisma.relative.create({data: body});
  }

  async findAll(branchId: number, skip: number, take: number, search?: string): Promise<any> {
    return Promise.resolve([]);
  }

  findBy(branchId: number, query: any): Promise<Relative[]> {
    return Promise.resolve([]);
  }

  findOne(id: number): Promise<Relative> {
    return Promise.resolve(undefined);
  }

  remove(id: number): void {
    this.prisma.relative.delete({where: {id}});
  }

  update(id: number, updates: any): Promise<Relative> {
    return this.prisma.relative.update({
      where: {id},
      data: updates
    });
  }
}
