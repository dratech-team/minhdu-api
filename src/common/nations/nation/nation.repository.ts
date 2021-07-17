import {District, Nation} from "@prisma/client";
import {PrismaService} from "../../../prisma.service";
import {CreateNationDto} from "./dto/create-nation.dto";
import {Injectable} from "@nestjs/common";

@Injectable()
export class NationRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  count(query?: any): Promise<number> {
    return Promise.resolve(0);
  }

  async create(body: CreateNationDto): Promise<Nation> {
    return await this.prisma.nation.create({data: body});
  }

  async findOne(id: number): Promise<Nation> {
    return await this.prisma.nation.findUnique({where: {id}});
  }

  findAll(): Promise<Nation[]> {
    return this.prisma.nation.findMany({
      orderBy: {name: 'desc'},
      include: {
        provinces: {
          include: {
            districts: {
              include: {
                wards: true
              }
            }
          }
        }
      }
    });
  }

  remove(id: number): void {
  }

  update(id: number, updates: any): Promise<Nation> {
    return Promise.resolve(undefined);
  }

}
