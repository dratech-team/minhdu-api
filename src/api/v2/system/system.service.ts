import {Injectable} from '@nestjs/common';
import {CreateSystemDto} from './dto/create-system.dto';
import {UpdateSystemDto} from './dto/update-system.dto';
import {PrismaService} from "../../../prisma.service";

@Injectable()
export class SystemService {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateSystemDto) {
    return await this.prisma.system.create({data: body});
  }

  async findAll() {
    return await this.prisma.system.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} system`;
  }

  async update(id: number, updates: UpdateSystemDto) {
    return await this.prisma.system.update({
      where: {id},
      data: {
        title: updates.title,
        
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} system`;
  }
}
