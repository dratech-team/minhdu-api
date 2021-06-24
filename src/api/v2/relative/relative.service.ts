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
          employee: {connect: {id: body.employeeId}},
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  findAll() {
    let items = [1, 3, 7, 6, 2, 9];
    console.log('mang ban dau', items);
    items.sort().reverse();
    console.log('mang sap xep ', items);

    for (let i = 0; i < items.length; i++) {
      let a = items[i] - (items[i + 1]);
      items.filter(e => {
        if (e === a) {
          console.log(items[i], items[i + 1], a);
        }
      });

    }
  }

  findOne(id: number) {
    return `This action returns a #${id} relative`;
  }

  async update(id: number, updates: UpdateRelativeDto) {
    try {
      return await this.prisma.relative.update({
        where: {id},
        data: {
          profile: {update: updates.profile},
          sos: updates.sos,
          relationship: updates.relationship,
          career: updates.career,
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  remove(id: number) {
    this.prisma.relative.delete({where: {id}}).catch(err => {
      console.error(err);
      throw new BadRequestException(err);
    });
  }
}
