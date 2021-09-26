import { Injectable } from "@nestjs/common";
import { Contract } from "@prisma/client";
import { PrismaService } from "../../../prisma.service";
import { CreateContractDto } from "./dto/create-contract.dto";

@Injectable()
export class ContractRepository {
  constructor(private readonly prisma: PrismaService) {}

  async count(): Promise<number> {
    return await this.prisma.contract.count();
  }

  async create(body: CreateContractDto): Promise<Contract> {
    const employee = await this.prisma.employee.findUnique({
      where: { id: body.employeeId },
      include: { position: true },
    });
    return await this.prisma.contract.create({
      data: {
        employee: { connect: { id: body.employeeId } },
        createdAt: body.createdAt,
        expiredAt: body.expiredAt,
        position: employee.position.name,
      },
    });
  }

  async findAll(): Promise<Contract[]> {
    return await this.prisma.contract.findMany();
  }

  findBy(branchId: number, query: any): Promise<[]> {
    return Promise.resolve([]);
  }

  findOne(id: number): Promise<Contract> {
    return Promise.resolve(undefined);
  }

  async update(id: number, updates: any): Promise<Contract> {
    return await this.prisma.contract.update({ where: { id }, data: updates });
  }

  remove(id: number): void {}
}
