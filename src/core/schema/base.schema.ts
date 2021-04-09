import { ObjectId } from "mongodb";
import { Prop, Schema } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { BasicSalary } from "../../api/v1/salary/modules/basic/schema/basic-salary.schema";

export type BaseDocument = Document & BaseSchema;

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
