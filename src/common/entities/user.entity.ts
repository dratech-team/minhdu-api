import { Prop, Schema } from "@nestjs/mongoose";
import { UserType } from "../../core/constants/role-type.constant";
import { BaseDocument } from "../../core/entities/base.entity";

@Schema()
export class IUser extends BaseDocument {
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
