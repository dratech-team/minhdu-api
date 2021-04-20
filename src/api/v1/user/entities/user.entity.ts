import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document, Types} from "mongoose";
import {IUser} from "../../../../common/entities/user.entity";
import {PositionEntity} from "../../position/entities/positionSchema";
import {DepartmentEntity} from "../../department/entities/departmentSchema";
import {BranchEntity} from "../../branch/entities/branch.entity";

export type UserDocument = UserEntity & Document;

@Schema()
export class UserEntity extends IUser {
  @Prop({type: Types.ObjectId, ref: "PositionEntity"})
  position: Types.ObjectId;

  @Prop({type: Types.ObjectId, ref: "DepartmentEntity"})
  department: Types.ObjectId;

  @Prop({type: Types.ObjectId, ref: "BranchEntity"})
  branch: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);

