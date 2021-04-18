import { Prop, Schema } from "@nestjs/mongoose";
import { BaseSchema } from "../../core/schema/base.schema";
import { UserType } from "../../core/constants/role-type.constant";

@Schema()
export class IUser extends BaseSchema {

  @Prop({ required: true })
  branchId: string;

  @Prop({ required: true })
  departmentId: string;

  @Prop({required: true})
  position: string;

  @Prop({ required: true })
  userCode: string;

  @Prop({required: true})
  fullName: string;

  @Prop()
  address: string;

  @Prop({required: true})
  dateOfBirth: string;

  @Prop()
  gender: string;

  @Prop({ required: false })
  email: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  userType: UserType;

}
