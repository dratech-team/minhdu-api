import {BaseRepository} from "../../../../common/repository/base.repository";
import {PrismaService} from "../../../../prisma.service";
import {BadRequestException, Injectable} from "@nestjs/common";
import {RemoveManyAbsentDto} from "./dto/remove-many-absent.dto";
import {CreateAbsentDto} from "./dto/create-absent.dto";
import {AbsentEntity} from "../../payroll/entities/absent.entity";

@Injectable()
export class AbsentRepository extends BaseRepository<AbsentEntity> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async createMany(bodys: CreateAbsentDto[]) {
    try {
      return await this.prisma.absentSalary.createMany({data: bodys});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll() {
    try {
      return await this.prisma.absentSalary.findMany();
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findOne(id: number) {
    return `This action returns a #${id} absent`;
  }

  async update(ids: number[], body: Partial<CreateAbsentDto>) {
    try {
      return await this.prisma.absentSalary.updateMany({
        where: {id: {in: ids}},
        data: body
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async removeMany(body: RemoveManyAbsentDto) {
    try {
      return await this.prisma.absentSalary.deleteMany({
        where: {id: {in: body.salaryIds}},
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
