import {Injectable} from "@nestjs/common";
import {Contract} from "@prisma/client";
import {InterfaceRepository} from "../../../common/repository/interface.repository";
import {ResponsePagination} from "../../../common/entities/response.pagination";
import {PrismaService} from "../../../prisma.service";
import {CreateContractDto} from "./dto/create-contract.dto";

@Injectable()
export class ContractRepository implements InterfaceRepository<Contract> {
  constructor(private readonly prisma: PrismaService) {
  }

  async count(): Promise<number> {
    return await this.prisma.contract.count();
  }

  create(body: CreateContractDto): Promise<Contract> {
    return this.prisma.contract.create({data: body});
  }

  findAll(branchId: number, skip: number, take: number, search?: string): Promise<ResponsePagination<Contract>> {
    return Promise.resolve(undefined);
  }

  findBy(branchId: number, query: any): Promise<[]> {
    return Promise.resolve([]);
  }

  findOne(id: number): Promise<Contract> {
    return Promise.resolve(undefined);
  }

  remove(id: number): void {
  }

  update(id: number, updates: any): Promise<Contract> {
    return Promise.resolve(undefined);
  }

}
