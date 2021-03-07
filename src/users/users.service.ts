import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UsersInterface } from './interfaces/users.interface';

@Injectable()
export class UsersService {

  constructor(@InjectModel('users') private readonly usersModel: Model<UsersInterface>) {}

  async create(createUserDto: CreateUserDto): Promise<UsersInterface> {
      return this.usersModel.create(createUserDto);
  }

  async findAll(): Promise<any> {
    return this.usersModel.find({}).lean()
  }

  async findOne(email: string): Promise<UsersInterface> {
    return this.usersModel.findOne({email});
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
