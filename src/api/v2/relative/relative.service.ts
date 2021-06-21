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
          profile: {create: body.profile},
          sos: body.sos,
          relationship: body.relationship,
          career: body.career,
          employee: {connect: {id: body.employeeId}}
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  findAll() {
    return `This action returns all relative`;
  }

  findOne(id: number) {
    return `This action returns a #${id} relative`;
  }

  update(id: number, updateRelativeDto: UpdateRelativeDto) {
    return `This action updates a #${id} relative`;
  }

  remove(id: number) {
    return `This action removes a #${id} relative`;
  }
}
