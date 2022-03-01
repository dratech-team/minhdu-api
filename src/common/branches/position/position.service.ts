import {BadRequestException, Injectable} from "@nestjs/common";
import {Position} from "@prisma/client";
import {CreatePositionDto} from "./dto/create-position.dto";
import {UpdatePositionDto} from "./dto/update-position.dto";
import {PositionRepository} from "./position.repository";
import {OnePosition} from "./entities/position.entity";
import {SearchPositionDto} from "./dto/search-position.dto";

@Injectable()
export class PositionService {
  constructor(private readonly repository: PositionRepository) {
  }

  async create(body: CreatePositionDto): Promise<Position> {
    return await this.repository.create(body);
  }

  async findAll(search: Partial<SearchPositionDto>): Promise<Position[]> {
    return this.repository.findAll(search);
  }

  findBranch(id: number): Promise<any> {
    return this.repository.findBranch(id);
  }

  async findOne(id: number): Promise<OnePosition> {
    return this.repository.findOne(id);
  }

  async update(id: number, updates: UpdatePositionDto) {
    return await this.repository.update(id, updates);
  }

  async remove(id: number) {
    const found = await this.findOne(id);
    if (
      (found.templates && found.templates.length) ||
      (found.employees && found.employees.length)
    ) {
      const name =
        found.templates.map((e) => e.title).join(", ") ||
        found.employees.map((e) => e.lastName).join(", ");
      throw new BadRequestException(
        `${found.name} đang được liên kết với các mục ${name}. Hãy xóa chúng trước khi xóa trường này.`
      );
    }
    return this.repository.remove(id);
  }
}
