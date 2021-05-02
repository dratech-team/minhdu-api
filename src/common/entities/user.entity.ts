import {Prop, Schema} from "@nestjs/mongoose";
import {GenderType} from "@prisma/client";
import {BaseDocument} from "../../core/entities/base.entity";

@Schema()
export class IUser extends BaseDocument {
  @Prop()
  fullName: string;

  @Prop()
  address: string;

  @Prop({type: Date})
  birthday: Date;

  @Prop({type: GenderType})
  gender: GenderType;

  @Prop()
  phone: string;

  @Prop({unique: true})
  email: string;

  @Prop()
  note: string;
}

