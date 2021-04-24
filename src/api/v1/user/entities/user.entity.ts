import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document, Types} from "mongoose";
import {IUser} from "../../../../common/entities/user.entity";
import {PositionEntity} from "../../position/entities/positionSchema";
import {DepartmentEntity} from "../../department/entities/departmentSchema";
import {BranchEntity} from "../../branch/entities/branch.entity";
import * as mongoose from "mongoose";
import {ISalary} from "../../../../common/entities/isalary.entity";

export type UserDocument = UserEntity & Document;

@Schema()
export class UserEntity extends IUser {
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: "PositionEntity"})
  position: Types.ObjectId;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: "DepartmentEntity"})
  department: Types.ObjectId;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: "BranchEntity"})
  branch: Types.ObjectId;

  @Prop([ISalary])
  basicsSalary: ISalary[];
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);

