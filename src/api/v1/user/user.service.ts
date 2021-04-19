import { Inject, Injectable } from "@nestjs/common";
import { BaseService } from "../../../core/crud-base/base.service";
import { UserDocument } from "./entities/user.schema";
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
}
