import {Injectable, Query} from '@nestjs/common';
import {CreateLoggerDto} from './dto/create-logger.dto';
import {UpdateLoggerDto} from './dto/update-logger.dto';
import {PrismaService} from "../../../prisma.service";

@Injectable()
export class LoggerService {
  constructor(private readonly prisma: PrismaService) {
  }

  create(createLoggerDto: CreateLoggerDto) {
    return this.prisma.systemHistory.create({data: createLoggerDto});
  }

  async findAll(take: number, skip: number) {
    let activity: string;
    const [total, data] = await Promise.all([
      this.prisma.systemHistory.count(),
      this.prisma.systemHistory.findMany({
        take: take || undefined,
        skip: skip || undefined
      }),
    ]);
    return {total, data};
  }

  async findOne(id: number) {
    return await this.prisma.systemHistory.findUnique({where: {id}});
  }

  update(id: number, updateLoggerDto: UpdateLoggerDto) {
    return this.prisma.systemHistory.update({where: {id}, data: updateLoggerDto});
  }

  remove(id: number) {
    return this.prisma.systemHistory.delete({where: {id}});
  }
}
