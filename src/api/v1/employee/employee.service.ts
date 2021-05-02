import {BadRequestException, ConflictException, HttpException, Injectable, NotFoundException} from "@nestjs/common";
import {EmployeeDocument, EmployeeEntity} from "./entities/employee.entity";
import {PaginateModel, PaginateOptions, PaginateResult} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {ModelName} from "../../../common/constant/database.constant";
import {ObjectId} from "mongodb";
import {UpdateEmployeeDto} from "./dto/update-employee.dto";
import {CreateEmployeeDto} from "./dto/create-employee.dto";
import {isEmpty} from "class-validator";
import {BranchService} from "../branch/branch.service";

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(ModelName.EMPLOYEE)
    private readonly model: PaginateModel<EmployeeDocument>,
    private readonly branchService: BranchService,
  ) {
  }

  async create(body: CreateEmployeeDto): Promise<EmployeeEntity> {
    try {
      const employee = new EmployeeEntity();
      employee.code = await this.generateEmployeeCode(body);
      employee.positionId = body.positionId;
      employee.workday = body.workday;
      employee.departmentId = body.departmentId;
      employee.branchId = body.branchId;
      employee.basicsSalary = [body.basicSalary];
      employee.fullName = body.name;
      employee.address = body.address;
      employee.birthday = body.birthday;
      employee.gender = body.gender;
      employee.phone = body.phone;
      employee.email = body.email;
      employee.note = body.note;

      return await this.model.create(employee);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async findOne(id: ObjectId): Promise<EmployeeEntity> {
    return this.model.findOne({_id: id, deleted: false});
  }

  async findAll(
    paginateOpts?: PaginateOptions,
  ): Promise<PaginateResult<EmployeeEntity>> {

    paginateOpts.populate = ["positionId", "departmentId", "branchId"];

    return await this.model.paginate({deleted: false}, paginateOpts);
  }

  async update(
    id: ObjectId,
    updates: UpdateEmployeeDto,
    salaryId?: ObjectId,
  ): Promise<any> {
    try {
      if (salaryId) {
        return await this.model.findOneAndUpdate(
          {_id: id, "basicsSalary._id": salaryId},
          {"$set": {"basicsSalary.$.title": updates.basicSalary.title}}
        ).orFail(new NotFoundException());
      } else {
        this.model.find({
          'basicsSalary': {
            $elemMatch: {
              title: updates.basicSalary.title
            }
          }
        }).then((found) => {
          if (found) {
            throw new ConflictException({message: 'Mục này đã tồn tại'});
          } else {
            return this.model.findByIdAndUpdate(
              {_id: id},
              {"$addToSet": {basicsSalary: updates.basicSalary}}
            ).lean();
          }
        });
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

  async generateEmployeeCode(body: CreateEmployeeDto): Promise<string> {
    const branch = await this.branchService.findById(body.branchId);
    const count = await this.model.count();
    let gen: string;
    if (count < 10) {
      gen = "000";
    } else if (count < 100) {
      gen = "00";
    } else if (count < 1000) {
      gen = "0";
    }

    return `${branch.code}${gen}${count + 1}`;
  }
}
