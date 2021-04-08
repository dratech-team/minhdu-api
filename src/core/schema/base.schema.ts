import { ObjectId } from "mongodb";
import { Prop, Schema } from "@nestjs/mongoose";

@Schema()
export class BaseSchema {
  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ required: false })
  deletedAt: Date;

  @Prop({ required: false })
  deletedBy: ObjectId;

  @Prop({ default: false })
  deleted: boolean;
}
