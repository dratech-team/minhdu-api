import { ObjectId } from "mongodb";
// import { USER_TYPE } from "@/core/constants/role-type.constant";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { USER_TYPE } from "../../../../core/constants/role-type.constant";

export type RoleDocument = Role & Document;

@Schema()
export class Role {
  @Prop()
  readonly type: USER_TYPE;

  @Prop()
  readonly userId: ObjectId;
}

export const RoleDocumentSchema = SchemaFactory.createForClass(Role);
