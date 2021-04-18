import { Prop, Schema } from "@nestjs/mongoose";
import { BaseSchema } from "../../core/schema/base.schema";
import { UserType } from "../../core/constants/role-type.constant";

@Schema()
export class IUser extends BaseSchema {

  @Prop()
  _id: string

  @Prop({ required: true })
  userCode: string;

  @Prop({required: true})
  fullName: string;

  @Prop({ required: true })
  branchCode: string;

  @Prop({ required: true })
  departmentCode: string;

  @Prop({required: true})
  positionCode: string;

  @Prop()
  address: string;

  @Prop({required: true})
  dateOfBirth: Date;

  @Prop()
  gender: string;

  @Prop({ required: false })
  email: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  userType: UserType;

}
