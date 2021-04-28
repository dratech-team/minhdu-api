import {BaseDocument} from "../../../../core/entities/base.entity";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {ObjectId} from "mongodb";
import * as mongoose from "mongoose";
import {Document} from "mongoose";
import * as mongoosePaginate from 'mongoose-paginate';

export type BranchDocument = BranchEntity & Document;

@Schema({autoIndex: true})
export class BranchEntity extends BaseDocument {
  @Prop()
  code: string;

  @Prop({unique: true})
  name: string;

  @Prop({type: ObjectId, ref: "Area"})
  areaId: ObjectId;
}

export const BranchSchema = SchemaFactory.createForClass(BranchEntity).plugin(mongoosePaginate);

export const Branch = mongoose.model('branches', BranchSchema);
