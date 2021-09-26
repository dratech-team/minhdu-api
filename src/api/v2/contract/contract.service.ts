import {Injectable} from '@nestjs/common';
import {CreateContractDto} from './dto/create-contract.dto';
import {UpdateContractDto} from './dto/update-contract.dto';
import {ContractRepository} from "./contract.repository";

@Injectable()
export class ContractService {
  constructor(private readonly repository: ContractRepository) {
  }

  async create(body: CreateContractDto) {
    return await this.repository.create(body);
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async findOne(id: number) {
    return await this.repository.findOne(id);
  }

  async update(id: number, updateContractDto: UpdateContractDto) {
    return await this.repository.update(id, updateContractDto);
  }

  remove(id: number) {
    return `This action removes a #${id} contract`;
  }
}
