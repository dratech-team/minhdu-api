import {Injectable,} from "@nestjs/common";
import {CreateOvertimeTemplateDto} from "./dto/create-overtime-template.dto";
import {SearchOvertimeTemplateDto} from "./dto/search-overtime-template.dto";
import {UpdateOvertimeTemplateDto} from "./dto/update-overtime-template.dto";
import {OvertimeTemplateRepository} from "./overtime-template.repository";

@Injectable()
export class OvertimeTemplateService {
  constructor(private readonly repository: OvertimeTemplateRepository) {
  }

  async create(body: CreateOvertimeTemplateDto) {
    return await this.repository.create(body);
  }

  async findAll(
    take: number,
    skip: number,
    search: Partial<SearchOvertimeTemplateDto>
  ) {
    const positionIds = (search?.positionIds || search?.positionIds?.length)
      ? Array.isArray(search?.positionIds)
        ? search?.positionIds?.map(id => Number(id))
        : Array.from(search?.positionIds).map(positionId => Number(positionId))
      : [];
    return await this.repository.findAll(take, skip, Object.assign(search, {positionIds}));
  }

  async findFirst(query: any) {
    return await this.repository.findFirst(query);
  }

  async findOne(id: number) {
    return await this.repository.findOne(id);
  }

  async update(id: number, updates: UpdateOvertimeTemplateDto) {
    return await this.repository.update(id, updates);
  }

  async remove(id: number) {
    return await this.repository.remove(id);
  }
}
