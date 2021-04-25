import {ConflictException, HttpException, Injectable} from "@nestjs/common";
import {BaseService} from "../../../core/crud-base/base.service";
import {UserDocument, UserEntity} from "./entities/user.entity";
import {FilterQuery, Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {ModelName} from "../../../common/constant/database.constant";
import {ObjectId} from "mongodb";
import {PaginatorOptions} from "../../../core/crud-base/interface/pagination.interface";
import {CorePaginateResult} from "../../../core/interfaces/pagination";
import {UpdateUserDto} from "./dto/update-user.dto";
import {CreateUserDto} from "./dto/create-user.dto";
import { isEmpty } from "class-validator";

@Injectable()
export class UserService extends BaseService<UserDocument> {
  constructor(
    @InjectModel(ModelName.USER)
    private readonly userModel: Model<UserDocument>,
  ) {
    super(userModel);
  }

  async create(body: CreateUserDto, ...args): Promise<UserEntity> {
    return super.create(body, ...args);
  }

  // async findOne(filter?: FilterQuery<UserDocument>): Promise<UserEntity> {
  //   const user = await this.userModel.findOne({_id: filter.id, deleted: false}).populate('BranchEntity', 'branch');
  //   return user;
  // }

  async findAll(
    paginateOpts?: PaginatorOptions,
    ...args
  ): Promise<CorePaginateResult<UserEntity>> {
    return await super.findAll(paginateOpts, ...args);
  }


  async update(
    id: ObjectId,
    updates: UpdateUserDto,
    salaryId?: ObjectId,
    ...args
  ): Promise<any> {
    try {
      if (salaryId) {
        return await this.userModel.updateOne(
          {_id: id, "basicsSalary._id": salaryId},
          {"$set": {"basicsSalary.$.title": "dime duoc roi"}}
        );
      } else {
        const found = await this.userModel.find({
          'basicsSalary': {
            $elemMatch: {
              title: updates.basicSalary.title
            }
          }
        });
        if (!isEmpty(found)) {
          throw new ConflictException({message: 'Mục này đã tồn tại'});
        } else {
          return await this.userModel.findByIdAndUpdate(
            {_id: id},
            {"$addToSet": {basicsSalary: updates.basicSalary}}
          ).lean();
        }
      }

    } catch (e) {
      throw  new HttpException(e, e.statusCode || 500);
    }
  }

  async remove(
    id: ObjectId,
    salaryId?: ObjectId,
  ): Promise<any> {
    try {
      if (isEmpty(salaryId)) {
        return await this.userModel.deleteOne({_id: id});
      } else {
        return await this.userModel.updateOne(
          {_id: id},
          {$pull: {basicsSalary: {_id: salaryId}}}
        );
      }
    } catch (e) {
      throw new HttpException(e, e.statusCode || 500);
    }
  }
}
