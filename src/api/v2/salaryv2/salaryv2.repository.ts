import {BadRequestException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../../prisma.service";
import {UpdateSalaryv2Dto} from "./dto/update-salaryv2.dto";
import {SalaryEntity} from "./entities/salary.entity";

@Injectable()
export class Salaryv2Repository {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: SalaryEntity) {
    try {
      return await this.prisma.salaryv2.create({
        data: {
          settingId: body.settingId,
          type: body.type,
          startedAt: body.startedAt,
          endedAt: body.endedAt,
          price: body.price,
          title: body.title,
          payrollId: body.payrollId,
          partial: body.partial,
          unit: body.unit
        }
      });
    } catch (err) {
      if (err.code === "P2002") {
        throw new BadRequestException("Buổi, từ ngày, đến ngày là duy nhất. không được trùng");
      }
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll() {
    try {
      return 'This action adds a new salaryv2';
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findOne(id: number) {
    try {
      return 'This action adds a new salaryv2';
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async update(id: number, updateSalaryv2Dto: UpdateSalaryv2Dto) {
    try {
      return 'This action adds a new salaryv2';
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.salaryv2.delete({where: {id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  private async validateDuplicate() {

  }
}
