import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import {Document} from "mongoose";
import {IUser} from "../../../../common/entities/user.entity";
import {SalaryEntity, SalarySchema} from "../../../../common/entities/salaryEntity";
import {ObjectId} from "mongodb";
import * as mongoosePaginate from "mongoose-paginate";

export type EmployeeDocument = EmployeeEntity & Document;

@Schema()
export class EmployeeEntity extends IUser {
  @Prop({unique: true})
  code: string;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: "Position"})
  positionId: ObjectId;

  @Prop()
  workday: number;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: "Department"})
  departmentId: ObjectId;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: "Branch"})
  branchId: ObjectId;

  @Prop([SalarySchema])
  basicsSalary: SalaryEntity[];
}

export const EmployeeSchema = SchemaFactory.createForClass(EmployeeEntity).plugin(mongoosePaginate);

export const Employee = mongoose.model('employees', EmployeeSchema);



