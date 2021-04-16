import { Document, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { UserType } from "../../../../core/constants/role-type.constant";
import { User } from "../../user/schema/user.schema";
import { BaseDocument } from "../../../../core/schema/base.schema";

export type PositionDocument = Position & Document;

@Schema()
export class Position extends BaseDocument {
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
