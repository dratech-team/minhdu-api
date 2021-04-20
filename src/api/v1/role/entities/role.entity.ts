import { ObjectId } from "mongodb";
// import { USER_TYPE } from "@/core/constants/role-type.constant";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { UserType } from "../../../../core/constants/role-type.constant";

export type RoleDocument = RoleEntity & Document;

@Schema()
export class RoleEntity {
  @Prop()
  readonly type: UserType;

  @Prop()
  readonly userId: ObjectId;
}

export const RoleDocumentSchema = SchemaFactory.createForClass(RoleEntity);
