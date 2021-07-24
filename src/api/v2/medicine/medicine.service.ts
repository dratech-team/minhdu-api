import {Injectable} from '@nestjs/common';
import {CreateMedicineDto} from './dto/create-medicine.dto';
import {UpdateMedicineDto} from './dto/update-medicine.dto';
import {MedicineRepository} from "./medicine.repository";

@Injectable()
export class MedicineService {
  constructor(private readonly repository: MedicineRepository) {
  }

  async create(body: CreateMedicineDto) {
    return await this.repository.create(body);
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async findOne(id: number) {
    return await this.repository.findOne(id);
  }

  async update(id: number, updates: UpdateMedicineDto) {
    return await this.repository.update(id, updates);
  }

  async remove(id: number) {
    return await this.repository.remove(id);
  }
}
