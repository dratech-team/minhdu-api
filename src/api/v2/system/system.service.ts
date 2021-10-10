import {Injectable} from '@nestjs/common';
import {CreateSystemDto} from './dto/create-system.dto';
import {UpdateSystemDto} from './dto/update-system.dto';
import {PrismaService} from "../../../prisma.service";

@Injectable()
export class SystemService {
  constructor(private readonly prisma: PrismaService) {
  }

  create(createSystemDto: CreateSystemDto) {
    return 'This action adds a new system';
  }

  findAll() {
    return `This action returns all system`;
  }

  findOne(id: number) {
    return `This action returns a #${id} system`;
  }

  async findHr() {
    return await this.prisma.system.findUnique({where: {id: 1}});
  }

  async update(id: number, updates: UpdateSystemDto) {
    return await this.prisma.system.upsert({
      where: {id},
      create: updates,
      update: updates,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} system`;
  }
}
