import {Injectable} from "@nestjs/common";
import {PrismaService} from "../../../prisma.service";

@Injectable()
export class OrgChartRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async findAll() {
    return await this.prisma.branch.findMany({
      select: {
        id: true,
        code: true,
        name: true,
      }
    });
  }
}
