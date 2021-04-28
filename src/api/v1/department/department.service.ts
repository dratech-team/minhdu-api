import {BadRequestException, HttpException, Injectable} from "@nestjs/common";
import {PaginateModel, PaginateOptions, PaginateResult} from "mongoose";
import {DepartmentDocument, DepartmentEntity} from "./entities/department.entity";
import {InjectModel} from "@nestjs/mongoose";
import {ModelName} from "../../../common/constant/database.constant";
import {CreateDepartmentDto} from "./dto/create-department.dto";
import {ObjectId} from "mongodb";
import {UpdateDepartmentDto} from "./dto/update-department.dto";
import {BranchService} from "../branch/branch.service";
import {isEmpty} from "class-validator";

@Injectable()
export class DepartmentService {
  constructor(
    @InjectModel(ModelName.DEPARTMENT)
    private readonly model: PaginateModel<DepartmentDocument>,
    private readonly branchService: BranchService,
  ) {
  }

  async create(body: CreateDepartmentDto): Promise<DepartmentEntity> {
    try {
      return await this.model.create(body);
      // this.branchService?.updateDepartmentToBranch(department._id, body.branchIds);
      //  department;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async findById(id: ObjectId): Promise<DepartmentEntity> {
    return this.model.findById(id);
  }

  async findAll(
    paginateOpts?: PaginateOptions
  ): Promise<PaginateResult<DepartmentEntity>> {
    paginateOpts.populate = ['branchIds'];
    return await this.model.paginate({deleted: false}, paginateOpts);
  }

  async update(
    id: ObjectId,
    updates: UpdateDepartmentDto,
  ): Promise<DepartmentEntity> {
    return this.model.findByIdAndUpdate(id, updates);
  }

  async remove(id: ObjectId, branchId?: ObjectId): Promise<any> {
    try {
      if (isEmpty(branchId)) {
        await this.model.findByIdAndUpdate(id, {deleted: true});
      } else {
        await this.model.updateOne(
          {_id: id},
          {$pull: {branchIds: branchId}}
        );
      }
    } catch (e) {
      throw new HttpException(e, e.statusCode);
    }
  }
}
