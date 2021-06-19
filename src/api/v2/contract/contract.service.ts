import {Injectable} from '@nestjs/common';
import {CreateContractDto} from './dto/create-contract.dto';
import {UpdateContractDto} from './dto/update-contract.dto';
import {ContractRepository} from "./contract.repository";

@Injectable()
export class ContractService {
  constructor(private readonly service: ContractRepository) {
  }

  create(body: CreateContractDto) {
    return this.service.create(body);
  }

  findAll() {
    return `This action returns all contract`;
  }

  findOne(id: number) {
    return `This action returns a #${id} contract`;
  }

  update(id: number, updateContractDto: UpdateContractDto) {
    return `This action updates a #${id} contract`;
  }

  remove(id: number) {
    return `This action removes a #${id} contract`;
  }
}
