import {OvertimeSalary} from "@prisma/client";
import {BaseRepository} from "../../../../common/repository/base.repository";
import {BadRequestException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../../../prisma.service";
import {CreateManyOvertimeDto} from "./dto/create-many-overtime.dto";
import {UpdateOvertimeDto} from "./dto/update-overtime.dto";
import {CreateOvertimeDto} from "./dto/create-overtime.dto";
import {RemoveManyOvertimeDto} from "./dto/remove-many-overtime.dto";
import {OvertimeEntity} from "./entities";

@Injectable()
export class OvertimeRepository extends BaseRepository<OvertimeEntity> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(body: CreateManyOvertimeDto) {
    try {
      return 'Chưa làm';
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async createMany(bodys: CreateOvertimeDto[]) {
    try {
      return await this.prisma.overtimeSalary.createMany({data: bodys});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll() {
    try {
      const [total, data] = await Promise.all([
        this.prisma.overtimeSalary.count(),
        this.prisma.overtimeSalary.findMany(),
      ]);
      return {total, data};
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async count() {
    try {
      return await this.prisma.overtimeSalary.count();
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findOne(id: number) {
    try {
      return `Chưa làm`;
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

  async updateMany(ids: number[], body: CreateOvertimeDto) {
    try {
      return await this.prisma.overtimeSalary.updateMany({
        where: {id: {in: ids}},
        data: body
      });
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

  async removeMany(body: RemoveManyOvertimeDto) {
    try {
      return await this.prisma.overtimeSalary.deleteMany({where: {id: {in: body.salaryIds}}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
