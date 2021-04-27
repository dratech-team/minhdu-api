import {Prop, Schema} from "@nestjs/mongoose";
import {UserType} from "../../core/constants/role-type.constant";
import {GenderEnum} from "../../core/enum/gender.enum";
import {BaseDocument} from "../../core/entities/base.entity";

@Schema()
export class IUser extends BaseDocument {
  @Prop()
  fullName: string;

  @Prop()
  address: string;

  @Prop({type: Date})
  birthday: Date;

  @Prop({type: GenderEnum})
  gender: GenderEnum;

  @Prop()
  phone: string;

  @Prop({unique: true})
  email: string;

  @Prop()
  note: string;
}

