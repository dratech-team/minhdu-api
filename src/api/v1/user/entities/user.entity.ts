import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document, Types} from "mongoose";
import {IUser} from "../../../../common/entities/user.entity";
import {PositionEntity} from "../../position/entities/position.entity";
import {DepartmentEntity} from "../../department/entities/department.entity";
import {BranchEntity} from "../../branch/entities/branch.entity";
import * as mongoose from "mongoose";
import {SalaryEntity, SalarySchema} from "../../../../common/entities/salaryEntity";
import {ObjectId} from "mongodb";

export type UserDocument = UserEntity & Document;

@Schema()
export class UserEntity extends IUser {
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: "PositionEntity"})
  position: ObjectId;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: "DepartmentEntity"})
  department: ObjectId;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: "BranchEntity"})
  branch: ObjectId;

  @Prop([SalarySchema])
  basicsSalary: SalaryEntity[];
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);

