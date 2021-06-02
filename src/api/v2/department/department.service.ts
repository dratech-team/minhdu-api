import {Injectable} from '@nestjs/common';
import {CreateDepartmentDto} from './dto/create-department.dto';
import {UpdateDepartmentDto} from './dto/update-department.dto';
import {Department} from '@prisma/client';
import {DepartmentRepository} from "./department.repository";

@Injectable()
export class DepartmentService {
  constructor(private readonly repository: DepartmentRepository) {
  }

  async create(body: CreateDepartmentDto): Promise<Department> {
    body.color = Math.floor(Math.random() * 16777215).toString(16);
    return this.repository.create(body);
  }

  async findAll(): Promise<any> {
    const departments = await this.repository.findAll();
    return departments.map(department => {
      return {
        id: department.id,
        name: department.name,
        color: department.color,
        branchId: department.branchId,
        positionIds: department.positions.map(position => position.id)
      };
    });
  }

  async findOne(id: number): Promise<Department> {
    return this.repository.findOne(id);
  }

  async update(id: number, updates: UpdateDepartmentDto): Promise<Department> {
    return this.repository.update(id, updates);
  }

  remove(id: number): void {
    this.repository.remove(id);
  }
}
