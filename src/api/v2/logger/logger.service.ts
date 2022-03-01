import {Injectable} from '@nestjs/common';
import {CreateLoggerDto} from './dto/create-logger.dto';
import {UpdateLoggerDto} from './dto/update-logger.dto';
import {PrismaService} from "../../../prisma.service";
import {ProfileEntity} from "../../../common/entities/profile.entity";

@Injectable()
export class LoggerService {
  constructor(private readonly prisma: PrismaService) {
  }

  create(createLoggerDto: CreateLoggerDto) {
    return this.prisma.systemHistory.create({data: createLoggerDto});
  }

  async findAll(profile: ProfileEntity, take: number, skip: number) {
    const account = await this.prisma.account.findUnique({where: {id: profile.id}});
    const [total, data] = await Promise.all([
      this.prisma.systemHistory.count({
        where: {
          appName: {in: account.appName}
        }
      }),
      this.prisma.systemHistory.findMany({
        take: take || undefined,
        skip: skip || undefined,
        orderBy: {createdAt: "desc"},
        where: {
          appName: {in: account.appName}
        },
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
