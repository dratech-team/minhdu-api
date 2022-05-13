import {BadRequestException, Injectable} from "@nestjs/common";
import {BaseRepository} from "../../../../common/repository/base.repository";
import {PrismaService} from "../../../../prisma.service";
import {DayoffEnity} from "./entities/dayoff.entity";
import {CreateDayoffDto} from "./dto/create-dayoff.dto";
import {UpdateDayoffDto} from "./dto/update-dayoff.dto";

@Injectable()
export class DayoffRepository extends BaseRepository<DayoffEnity> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(body: CreateDayoffDto) {
    try {
      return "";
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll() {
    try {
      return "";
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findOne(id: number) {
    try {
      return "";
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async update(id: number, updateDayoffDto: UpdateDayoffDto) {
    try {
      return "";
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async remove(id: number) {
    try {
      return "";
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
