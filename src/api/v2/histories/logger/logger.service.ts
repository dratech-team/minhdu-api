import {Injectable} from '@nestjs/common';
import {CreateLoggerDto} from './dto/create-logger.dto';
import {UpdateLoggerDto} from './dto/update-logger.dto';
import {PrismaService} from "../../../../prisma.service";
import {ProfileEntity} from "../../../../common/entities/profile.entity";
import {SearchLoggerDto} from "./dto/search-logger.dto";

@Injectable()
export class LoggerService {
  constructor(private readonly prisma: PrismaService) {
  }

  create(createLoggerDto: CreateLoggerDto) {
    return this.prisma.systemHistory.create({data: createLoggerDto});
  }

  async findAll(profile: ProfileEntity, search: SearchLoggerDto) {
    const account = await this.prisma.account.findUnique({where: {id: profile.id}});

    const [total, data] = await Promise.all([
      this.prisma.systemHistory.count({
        where: {
          appName: {in: account.appName},
          name: {contains: search?.name, mode: "insensitive"},
          description: {contains: search?.description, mode: "insensitive"},
          activity: {contains: search?.activity, mode: "insensitive"},
          body: {contains: search?.name, mode: "insensitive"},
        },
      }),
      this.prisma.systemHistory.findMany({
        take: search?.take,
        skip: search?.skip,
        orderBy: {createdAt: "desc"},
        where: {
          appName: {in: account.appName},
          name: {contains: search?.name, mode: "insensitive"},
          description: {contains: search?.description, mode: "insensitive"},
          activity: {contains: search?.activity, mode: "insensitive"},
          body: {contains: search?.name, mode: "insensitive"},
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
