import {ObjectId} from "mongodb";
import {Prop, Schema} from "@nestjs/mongoose";
import {Document} from "mongoose";
import {BasicSalaryEntity} from "../../api/v1/basic/entities/basic-salary.schema";

@Schema()
export class BaseDocument {
  _id: ObjectId;

  @Prop({default: Date.now})
  createdAt: Date;

  @Prop({default: Date.now})
  updatedAt: Date;

  @Prop({required: false})
  deletedAt: Date;

  @Prop({required: false})
  deletedBy: ObjectId;

  @Prop({default: false})
  deleted: boolean;
}
