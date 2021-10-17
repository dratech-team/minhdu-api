import {Injectable} from '@nestjs/common';
import {CreateRoleDto} from './dto/create-role.dto';
import {UpdateRoleDto} from './dto/update-role.dto';
import {PrismaService} from "../../../prisma.service";
import {Role} from "@prisma/client";

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {
  }

  create(createRoleDto: CreateRoleDto) {
    return 'This action adds a new role';
  }

  async findAll() {
    return roles;
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

const roles = [
  {
    name: "Nhân sự",
    role: Role.HUMAN_RESOURCE,
  },
  {
    name: "Kế toán trại",
    role: Role.CAMP_ACCOUNTING,
  },
  {
    name: "Quản lý trại",
    role: Role.CAMP_MANAGER,
  }
];
