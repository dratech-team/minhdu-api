import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {BaseService} from "../../../core/crud-base/base.service";
import {UserDocument, UserEntity} from "./entities/user.entity";
import {Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {ModelName} from "../../../common/constant/database.constant";
import {ObjectId} from "mongodb";
import {PaginatorOptions} from "../../../core/crud-base/interface/pagination.interface";
import {CorePaginateResult} from "../../../core/interfaces/pagination";
import {UpdateUserDto} from "./dto/update-user.dto";
import {CreateUserDto} from "./dto/create-user.dto";
import {isEmpty} from '../../../common/utils/array.utils';

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

  async findOne(id: ObjectId, ...args): Promise<UserEntity> {
    const user = await this.userModel.findOne({_id: id, deleted: false}).populate('BranchEntity', 'branch');
    console.log(user);
    return user;
  }

  async findAll(
    paginateOpts?: PaginatorOptions,
    ...args
  ): Promise<CorePaginateResult<UserEntity>> {
    return await super.findAll(paginateOpts, ...args);
  }


  async updateUser(
    id: ObjectId,
    salaryId: ObjectId,
    updates: UpdateUserDto,
    ...args
  ): Promise<any> {
    try {
      if (salaryId) {
        const salary = await this.userModel.findOne({_id: id}).findOne({"basicsSalary._id": salaryId}).lean();

        console.log(salary)
        // return updatedSalary;

      } else {
        const found = await this.userModel.find({
          'basicsSalary': {
            $elemMatch: {
              title: updates.basicSalary.title
            }
          }
        });
        if (!isEmpty(found)) {
          console.log("Muc nay da ton tai");
        } else {
          const updated = await this.userModel.updateOne(
            {_id: id},
            {$push: {"basicsSalary": updates.basicSalary}}
          ).lean();

          return updates;
        }
      }

    } catch (e) {
      throw  new HttpException(e, e.statusCode || 500);
    }


    // return await super.update(id, updates);
  }

  async remove(id: ObjectId, ...args): Promise<void> {
    return super.remove(id, args);
  }
}
