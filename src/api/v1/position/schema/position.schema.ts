import { Document, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "../../../../core/schema/base.schema";
import { UserType } from "../../../../core/constants/role-type.constant";
import { User } from "../../user/schema/user.schema";

export type PositionDocument = Position & Document;

@Schema()
export class Position extends BaseSchema {
  @Prop()
  position: string;

  @Prop()
  wordDay: number;

  @Prop()
  userType: UserType;

  @Prop({ type: Types.ObjectId, ref: "User" })
  userId: User;
}

export const PositionSchema = SchemaFactory.createForClass(Position);
