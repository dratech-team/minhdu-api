import {BadRequestException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../../prisma.service";
import {CreateLocationDto} from "./dto/create-location.dto";

@Injectable()
export class LocationRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateLocationDto) {
    try {
      return await this.prisma.location.create({data: body});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
