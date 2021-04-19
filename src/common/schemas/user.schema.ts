import { Prop, Schema } from "@nestjs/mongoose";
import { BaseDocument } from "../../core/schema/base.schema";
import { UserType } from "../../core/constants/role-type.constant";
import {GenderEnum} from "../../core/enum/gender.enum";
import {User} from "../../api/v1/user/schema/user.schema";

@Schema()
export class IUser extends BaseDocument {
  @Prop({required: true})
  branchCode: string;

  @Prop({required: true})
  departmentCode: string;

  @Prop({required: true})
  positionCode: string;

  @Prop({required: true, unique: true})
  userCode: string;

  @Prop({required: true})
  fullName: string;

  @Prop({required: true})
  address: string;

  @Prop({required: true})
  dateOfBirth: Date;

  @Prop({required: true})
  gender: GenderEnum;

  @Prop({required: true})
  phoneNumber: string;

  @Prop({ required: false })
  email: string;

  @Prop()
  userType: UserType;

}

