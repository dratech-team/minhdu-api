import {BadRequestException, ConflictException, HttpException, Injectable} from "@nestjs/common";
import {UserDocument, UserEntity} from "./entities/user.entity";
import {PaginateModel, PaginateOptions, PaginateResult} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {ModelName} from "../../../common/constant/database.constant";
import {ObjectId} from "mongodb";
import {UpdateUserDto} from "./dto/update-user.dto";
import {CreateUserDto} from "./dto/create-user.dto";
import {isEmpty} from "class-validator";
import {BranchService} from "../branch/branch.service";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(ModelName.USER)
    private readonly model: PaginateModel<UserDocument>,
    private readonly branchService: BranchService,
  ) {
  }

  async create(body: CreateUserDto): Promise<UserEntity> {
    try {
      body.code = await this.generateEmployeeCode(body);

      return await this.model.create(body);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async findAll(
    paginateOpts?: PaginateOptions,
  ): Promise<PaginateResult<UserEntity>> {
    return await this.model.paginate({deleted: false}, paginateOpts);
  }

  async update(
    id: ObjectId,
    updates: UpdateUserDto,
    salaryId?: ObjectId,
  ): Promise<any> {
    try {
      if (salaryId) {
        return await this.model.updateOne(
          {_id: id, "basicsSalary._id": salaryId},
          {"$set": {"basicsSalary.$.title": "dime duoc roi"}}
        );
      } else {
        const found = await this.model.find({
          'basicsSalary': {
            $elemMatch: {
              title: updates.basicSalary.title
            }
          }
        });
        if (!isEmpty(found)) {
          throw new ConflictException({message: 'Mục này đã tồn tại'});
        } else {
          return await this.model.findByIdAndUpdate(
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
        return await this.model.deleteOne({_id: id});
      } else {
        return await this.model.findByIdAndUpdate(
          id, {$pull: {basicsSalary: {_id: salaryId}}}
        );
      }
    } catch (e) {
      throw new HttpException(e, e.statusCode || 500);
    }
  }

  async generateEmployeeCode(body: CreateUserDto): Promise<string> {
    const branch = await this.branchService.findById(body.branch);
    const count = await this.model.count();
    let gen: string;
    if (count < 10) {
      gen = "000";
    } else if (count < 100) {
      gen = "00";
    } else if (count < 1000) {
      gen = "0";
    }

    return `${branch.code} + ${gen} + ${count + 1}`;
  }
}
