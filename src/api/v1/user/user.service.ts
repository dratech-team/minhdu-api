import { Inject, Injectable } from "@nestjs/common";
import { BaseService } from "../../../core/crud-base/base.service";
import { UserDocument } from "./schema/user.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { ModelName } from "../../../common/constant/database.constant";

@Injectable()
export class UserService extends BaseService<UserDocument> {
  constructor(
    @InjectModel(ModelName.USER)
    private readonly userModel: Model<UserDocument>
  ) {
    super(userModel);
  }

  async findOne(id: Types.ObjectId, ...args): Promise<any> {
    return await super.findOne(id, ...args);
  }

  async findAll(
      paginateOpts?: PaginatorOptions,
      ...args
  ): Promise<CorePaginateResult<User>> {
    return await super.findAll(paginateOpts, ...args);
  }

  async update(
      id: Types.ObjectId,
      updates: CreateUserDto,
      ...args
  ): Promise<User> {
    return await super.update(id, updates, ...args);
  }

  async delete(id: Types.ObjectId, ...args): Promise<void> {
    await this.userModel.updateOne({ _id: id }, { deleted: true });
  }
}
