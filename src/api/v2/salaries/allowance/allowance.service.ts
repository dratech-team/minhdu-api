import { Injectable } from '@nestjs/common';
import { CreateAllowanceDto } from './dto/create-allowance.dto';
import { UpdateAllowanceDto } from './dto/update-allowance.dto';
import {AllowanceRepository} from "./allowance.repository";
import {DeleteMultipleAllowanceDto} from "./dto/delete-multiple-allowance.dto";

@Injectable()
export class AllowanceService {
  constructor(private readonly repository: AllowanceRepository) {
  }

  createMany(body: CreateAllowanceDto) {
    return this.repository.create(body);
  }

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: number) {
    return this.repository.findOne(id);
  }

  updateMany(body: UpdateAllowanceDto) {
    // return this.repository.update(body)
  }

  removeMany(body: DeleteMultipleAllowanceDto) {
    return this.repository.remove(body);
  }
}
