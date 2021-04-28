import {Document} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {BaseDocument} from "../../../../core/entities/base.entity";
import {ObjectId} from "mongodb";
import * as mongoosePaginate from "mongoose-paginate";
import * as mongoose from "mongoose";

export type PositionDocument = PositionEntity & Document;

@Schema({autoIndex: true})
export class PositionEntity extends BaseDocument {
  @Prop({unique: true})
  name: string;

  @Prop({type: [{type: ObjectId, ref: "Department"}]})
  departmentIds: ObjectId[];
}

export const PositionSchema = SchemaFactory.createForClass(PositionEntity).plugin(mongoosePaginate);

export const Position = mongoose.model('positions', PositionSchema);
