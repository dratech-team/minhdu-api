import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateDegreeDto} from './dto/create-degree.dto';
import {UpdateDegreeDto} from './dto/update-degree.dto';
import {PrismaService} from "../../../prisma.service";
import {EmployeeService} from "../employee/employee.service";

@Injectable()
export class DegreeService {
  constructor(private readonly prisma: PrismaService, private readonly employeeService: EmployeeService) {
  }

  async create(body: CreateDegreeDto) {
    try {
      const created = await this.prisma.degree.create({data: body});
      return await this.employeeService.findOne(created.employeeId);
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  findAll() {
    return `This action returns all degree`;
  }

  findOne(id: number) {
    return `This action returns a #${id} degree`;
  }

  async update(id: number, updates: UpdateDegreeDto) {
    try {
      const updated = await this.prisma.degree.update({
        where: {id},
        data: updates
      });
      return await this.employeeService.findOne(updated.employeeId);
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async remove(id: number) {
    const removed = await this.prisma.degree.delete({where: {id}});
    return await this.employeeService.findOne(removed.employeeId);
  }
}
