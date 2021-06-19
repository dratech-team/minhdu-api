import {InterfaceRepository} from "../../../common/repository/interface.repository";
import {Profile} from '@prisma/client';
import {ResponsePagination} from "../../../common/entities/response.pagination";
import {PrismaService} from "../../../prisma.service";
import {CreateProfileDto} from "./dto/create-profile.dto";

export class ProfileRepository implements InterfaceRepository<Profile> {
  constructor(private readonly prisma: PrismaService) {
  }

  count(query?: any): Promise<number> {
    return Promise.resolve(0);
  }

  create(body: CreateProfileDto): Promise<Profile> {
    return this.prisma.profile.create({data: body});
  }

  findAll(id: number, skip: number, take: number, search?: string): Promise<ResponsePagination<Profile>> {
    return Promise.resolve(undefined);
  }

  findBy(branchId: number, query: any): Promise<Profile[]> {
    return Promise.resolve([]);
  }

  findOne(id: number): Promise<Profile> {
    return Promise.resolve(undefined);
  }

  remove(id: number): void {
  }

  update(id: number, updates: any): Promise<Profile> {
    return Promise.resolve(undefined);
  }

}
