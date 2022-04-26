import {BadRequestException, Injectable} from "@nestjs/common";
import {AllowanceSalary} from "@prisma/client";
import {BaseRepository} from "../../../../common/repository/base.repository";
import {PrismaService} from "../../../../prisma.service";
import {CreateAllowanceDto} from "./dto/create-allowance.dto";
import {UpdateAllowanceDto} from "./dto/update-allowance.dto";
import {DeleteMultipleAllowanceDto} from "./dto/delete-multiple-allowance.dto";

@Injectable()
export class AllowanceRepository extends BaseRepository<AllowanceSalary, any> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  create(body: CreateAllowanceDto) {
    try {
      return 'This action adds a new allowance';
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  findAll() {
    try {
      return 'This action adds a new allowance';
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  findOne(id: number) {
    try {
      return 'This action adds a new allowance';
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  update(ids: number[], body: UpdateAllowanceDto) {
    try {
      return 'This action adds a new allowance';
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  remove(body: DeleteMultipleAllowanceDto) {
    try {
      return 'This action adds a new allowance';
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}