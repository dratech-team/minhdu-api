import { Prop, Schema } from "@nestjs/mongoose";
import { BaseSchema } from "../../core/schema/base.schema";
import { UserType } from "../../core/constants/role-type.constant";

@Schema()
export class IUser extends BaseSchema {
  @Prop({ required: false })
  email: string;

  @Prop({ required: false })
  password: number;

  @Prop()
  userType: UserType;

  @Prop()
  phone: string;

  @Prop()
  fullName: string;

  @Prop()
  address: string;
}
