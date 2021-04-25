import {Injectable, InternalServerErrorException, NotFoundException} from "@nestjs/common";
import {BaseService} from "../../../core/crud-base/base.service";
import {Model} from "mongoose";
import {DepartmentDocument, DepartmentEntity} from "./entities/department.entity";
import {InjectModel} from "@nestjs/mongoose";
import {ModelName} from "../../../common/constant/database.constant";
import {CreateDepartmentDto} from "./dto/create-department.dto";
import {ObjectId} from "mongodb";
import {PaginatorOptions} from "../../../core/crud-base/interface/pagination.interface";
import {CorePaginateResult} from "../../../core/interfaces/pagination";
import {UpdateDepartmentDto} from "./dto/update-department.dto";
import {BranchService} from "../branch/branch.service";
import {isEmpty} from "class-validator";

@Injectable()
export class DepartmentService extends BaseService<DepartmentDocument> {
  constructor(
    @InjectModel(ModelName.DEPARTMENT)
    private readonly departmentModel: Model<DepartmentDocument>,
    private readonly branchService: BranchService,
  ) {
    super(departmentModel);
  }

  async create(body: CreateDepartmentDto, ...args): Promise<DepartmentEntity> {
    const department = await super.create(body, ...args);
    this.branchService?.updateDepartment(department._id, body.branchIds);
    return department;
  }

  async findById(id: ObjectId): Promise<DepartmentEntity> {
    return super.findById(id);
  }

  async findAll(
    paginateOpts?: PaginatorOptions,
    ...args
  ): Promise<CorePaginateResult<DepartmentEntity>> {
    return super.findAll(paginateOpts, ...args);
  }

  async update(
    id: ObjectId,
    updates: UpdateDepartmentDto,
    ...args
  ): Promise<DepartmentEntity> {
    return super.update(id, updates, ...args);
  }

  async remove(id: ObjectId, branchId?: ObjectId): Promise<any> {
    try {
      if (isEmpty(branchId)) {
        await this.departmentModel.deleteOne({_id: id});
      } else {
        await this.departmentModel.updateOne(
          {_id: id},
          {$pull: {branchIds: branchId}}
        );
      }
    } catch (e) {
      throw new InternalServerErrorException(e);
    }

  }
}
