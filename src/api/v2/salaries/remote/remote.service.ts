import { Injectable } from '@nestjs/common';
import { CreateRemoteDto } from './dto/create-remote.dto';
import { UpdateRemoteDto } from './dto/update-remote.dto';

@Injectable()
export class RemoteService {
  create(createRemoteDto: CreateRemoteDto) {
    return 'This action adds a new remote';
  }

  findAll() {
    return `This action returns all remote`;
  }

  findOne(id: number) {
    return `This action returns a #${id} remote`;
  }

  update(id: number, updateRemoteDto: UpdateRemoteDto) {
    return `This action updates a #${id} remote`;
  }

  remove(id: number) {
    return `This action removes a #${id} remote`;
  }
}
