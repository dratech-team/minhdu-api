import {Injectable} from '@nestjs/common';
import {CreateRoleDto} from './dto/create-role.dto';
import {UpdateRoleDto} from './dto/update-role.dto';
import {PrismaService} from "../../../prisma.service";
import {AppEnum, Role} from "@prisma/client";
import {ProfileEntity} from "../../../common/entities/profile.entity";

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateRoleDto) {
    return await this.prisma.role.create({data: body});
  }

  async findAll(profile: ProfileEntity) {
    return await this.prisma.role.findMany({
      where: {
        appName: profile?.appName,
      }
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
