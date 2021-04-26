import {BaseDocument} from "../../../../core/entities/base.entity";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import {Document} from "mongoose";
import * as mongoosePaginate from 'mongoose-paginate';
import {BranchEntity, BranchSchema} from "../../branch/entities/branch.entity";

export type DepartmentDocument = DepartmentEntity & Document;

@Schema({autoIndex: true})
export class DepartmentEntity extends BaseDocument {
  @Prop({type: String, unique: true})
  department: string;

  @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: "Branch"}]})
  branches: BranchEntity[];
}

export const DepartmentSchema = SchemaFactory.createForClass(DepartmentEntity).plugin(mongoosePaginate);

export const Department = mongoose.model('departments', DepartmentSchema);