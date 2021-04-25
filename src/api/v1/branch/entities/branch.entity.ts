import {BaseDocument} from "../../../../core/entities/base.entity";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {ObjectId} from "mongodb";
import {AreaEntity} from "../../area/entities/area.entity";
import {Document} from "mongoose";
import * as mongoose from "mongoose";

export type BranchDocument = BranchEntity & Document;

@Schema()
export class BranchEntity extends BaseDocument {
  @Prop()
  code: string;

  @Prop()
  branch: string;

  @Prop({type: ObjectId, ref: "Area"})
  areaId: AreaEntity;

  @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: "DepartmentEntity"}]})
  departmentIds: ObjectId[];
}

export const BranchSchema = SchemaFactory.createForClass(BranchEntity);
