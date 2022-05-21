import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateRelativeDto} from './dto/create-relative.dto';
import {UpdateRelativeDto} from './dto/update-relative.dto';
import {PrismaService} from "../../../prisma.service";

@Injectable()
export class RelativeService {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateRelativeDto) {
    try {
      return await this.prisma.relative.create({
        data: {
          lastName: body.lastName,
          identify: body.identify,
          idCardAt: body.idCardAt,
          issuedBy: body.issuedBy,
          wardId: body.wardId,
          employeeId: body.employeeId,
          gender: body.gender,
          phone: body.phone,
          workPhone: body.workPhone,
          birthday: body.birthday,
          address: body.address,
          religion: body.religion,
          mst: body.mst,
          sos: body.sos,
          birthplace: body.birthplace,
          career: body.career,
          ethnicity: body.ethnicity,
          relationship: body.relationship,
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  findAll() {
  }

  findOne(id: number) {
    return `This action returns a #${id} relative`;
  }

  async update(id: number, body: UpdateRelativeDto) {
    try {
      return await this.prisma.relative.update({
        where: {id},
        data: {
          lastName: body.lastName,
          identify: body.identify,
          idCardAt: body.idCardAt,
          issuedBy: body.issuedBy,
          wardId: body.wardId,
          employeeId: body.employeeId,
          gender: body.gender,
          phone: body.phone,
          workPhone: body.workPhone,
          birthday: body.birthday,
          address: body.address,
          religion: body.religion,
          mst: body.mst,
          sos: body.sos,
          birthplace: body.birthplace,
          career: body.career,
          ethnicity: body.ethnicity,
          relationship: body.relationship,
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.relative.delete({where: {id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
