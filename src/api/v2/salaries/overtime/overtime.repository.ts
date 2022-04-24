import {OvertimeSalary} from "@prisma/client";
import {BaseRepository} from "../../../../common/repository/base.repository";
import {BadRequestException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../../../prisma.service";
import {CreateMultipleOvertimeDto} from "./dto/create-multiple-overtime.dto";
import {UpdateOvertimeDto} from "./dto/update-overtime.dto";
import {CreateOvertimeDto} from "./dto/create-overtime.dto";
import {DeleteMultipleOvertimeDto} from "./dto/delete-multiple-overtime.dto";

@Injectable()
export class OvertimeRepository extends BaseRepository<OvertimeSalary, any> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(body: CreateMultipleOvertimeDto) {
    try {
      return 'This action adds a new overtime';
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
      return `This action returns all overtime`;
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findOne(id: number) {
    try {
      return `This action returns a #${id} overtime`;
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async update(id: number, body: UpdateOvertimeDto) {
    try {
      return `This action updates a #${id} overtime`;
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
      return `This action removes a #${id} overtime`;
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async removeMany(body: DeleteMultipleOvertimeDto) {
    try {
      return await this.prisma.overtimeSalary.deleteMany({where: {id: {in: body.salaryIds}}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
