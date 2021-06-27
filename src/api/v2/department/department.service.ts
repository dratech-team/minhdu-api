import {Injectable} from '@nestjs/common';
import {CreateDepartmentDto} from './dto/create-department.dto';
import {UpdateDepartmentDto} from './dto/update-department.dto';
import {Department} from '@prisma/client';
import {DepartmentRepository} from "./department.repository";
import {BaseDepartmentService} from "./base-department.service";

@Injectable()
export class DepartmentService implements BaseDepartmentService {
  constructor(private readonly repository: DepartmentRepository) {
  }

  async create(body: CreateDepartmentDto): Promise<Department> {
    return this.repository.create(body);
  }

  async findAll(): Promise<any> {
    return this.repository.findAll().then(departments => {
      return departments.map(department => {
        return {
          id: department.id,
          name: department.name,
          color: department.color,
          branchId: department.branchId,
          positionIds: department.positions.map(position => position.id),
        };
      });
    });
  }

  async findOne(id: number): Promise<Department> {
    return this.repository.findOne(id);
  }

  async update(id: number, updates: UpdateDepartmentDto): Promise<Department> {
    return this.repository.update(id, updates);
  }

  async remove(id: number) {
    return this.repository.remove(id);
  }
}
