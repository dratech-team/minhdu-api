import {BaseDocument} from "../../../../core/entities/base.entity";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import {Document} from "mongoose";
import {ObjectId} from "mongodb";

export type DepartmentDocument = DepartmentEntity & Document;

@Schema({autoIndex: true})
export class DepartmentEntity extends BaseDocument {
  @Prop({type: String, unique: true})
  department: string;

  @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: "BranchEntity"}]})
  branchIds: ObjectId[];
}

export const DepartmentSchema = SchemaFactory.createForClass(DepartmentEntity);
