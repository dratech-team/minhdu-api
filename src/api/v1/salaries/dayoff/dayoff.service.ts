import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateDayoffDto} from './dto/create-dayoff.dto';
import {UpdateDayoffDto} from './dto/update-dayoff.dto';
import {DayoffRepository} from "./dayoff.repository";
import {CreateManyDayoffDto} from "./dto/create-many-dayoff.dto";
import {RemoveManyDayoffDto} from "./dto/remove-many-dayoff.dto";
import {UpdateManyDayoffDto} from "./dto/update-many-dayoff.dto";

@Injectable()
export class DayoffService {
  constructor(private readonly repository: DayoffRepository) {
  }

  create(body: CreateDayoffDto) {
    return this.repository.create(body);
  }

  createMany(body: CreateManyDayoffDto) {
    const bodys = body.payrollIds.map(payrollId => {
      return this.mapToDayOff(Object.assign(body, {payrollId}));
    });
    return this.repository.createMany(bodys);
  }

  findAll() {
    return this.repository.findAll();
  }

  async count() {
    try {
      return await this.repository.count();
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }


  findOne(id: number) {
    return this.repository.findOne(id);
  }

  update(id: number, updateDayoffDto: UpdateDayoffDto) {
    return this.repository.update(id, updateDayoffDto);
  }

  updateMany(body: UpdateManyDayoffDto) {
    return this.repository.updateMany(body.salaryIds, this.mapToDayOff(body));
  }

  remove(id: number) {
    return this.repository.remove(id);
  }

  removeMany(body: RemoveManyDayoffDto) {
    return this.repository.removeMany(body);
  }

  private mapToDayOff(body: CreateDayoffDto | UpdateDayoffDto): CreateDayoffDto {
    return {
      title: body.title,
      payrollId: body.payrollId,
      partial: body.partial,
      startedAt: body.startedAt,
      endedAt: body.endedAt,
      note: body.note
    };
  }
}
