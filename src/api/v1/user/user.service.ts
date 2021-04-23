import {Injectable} from "@nestjs/common";
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

  async update(
    id: ObjectId,
    updates: UpdateUserDto,
    ...args
  ): Promise<UserEntity> {
    return await super.update(id, updates, ...args);
  }

  async remove(id: ObjectId, ...args): Promise<void> {
    return super.remove(id, args);
  }
}
