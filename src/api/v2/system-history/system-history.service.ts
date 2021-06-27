import {BadRequestException, Injectable} from '@nestjs/common';
import {ActivityType, AppEnum} from '@prisma/client';
import {PrismaService} from "../../../prisma.service";

@Injectable()
export class SystemHistoryService {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(employeeId: number, ip: string, appName: AppEnum, object: string, activity: ActivityType, description: string) {
    try {
      return await this.prisma.systemHistory.create({
        data: {
          employeeId,
          ip,
          appName,
          object,
          activity,
          description
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  findAll() {
    return `This action returns all systemHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} systemHistory`;
  }

  update(id: number) {
    return `This action updates a #${id} systemHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} systemHistory`;
  }
}
