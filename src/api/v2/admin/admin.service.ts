import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateAdminDto} from './dto/create-admin.dto';
import {UpdateAdminDto} from './dto/update-admin.dto';
import {PrismaService} from "../../../prisma.service";
import {SearchAdminDto} from "./dto/search-admin.dto";
import {TypeEnum} from "./entities/type.enum";
import {firstDatetime} from "../../../utils/datetime.util";

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {
  }

  create(createAdminDto: CreateAdminDto) {
    return 'This action adds a new admin';
  }

  async findAll(take: number, skip: number, search: Partial<SearchAdminDto>) {
    try {
      const datetimes = await this.prisma.payroll.groupBy({
        by: ['createdAt'],
        orderBy: {
          createdAt: "asc"
        }
      });

      // console.log(datetimes);
      const hr = await Promise.all(datetimes.map(async datetime => {
        // return await this.prisma.payroll.findMany({
        //   take: take || undefined,
        //   skip: skip || undefined,
        //   where: {
        //     createdAt: search.type === TypeEnum.YEAR ? {
        //       gte: firstDatetimeOfMonth()
        //     } : {}
        //   }
        // });
      }))
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
