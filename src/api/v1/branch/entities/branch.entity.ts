import {BaseDocument} from "../../../../core/entities/base.entity";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {ObjectId} from "mongodb";
import {AreaEntity} from "../../area/entities/area.entity";
import {Document} from "mongoose";
import * as mongoose from "mongoose";
import * as mongoosePaginate from 'mongoose-paginate';

export type BranchDocument = BranchEntity & Document;

@Schema()
export class BranchEntity extends BaseDocument {
  @Prop()
  code: string;

  @Prop({unique: true})
  name: string;

  @Prop({type: ObjectId, ref: "Area"})
  areaId: ObjectId;

  @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: "Department"}]})
  departmentIds: ObjectId[];
}

export const BranchSchema = SchemaFactory.createForClass(BranchEntity).plugin(mongoosePaginate);

export const Branch = mongoose.model('branches', BranchSchema);
