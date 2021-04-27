import {Document} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {BaseDocument} from "../../../../core/entities/base.entity";
import {ObjectId} from "mongodb";
import * as mongoosePaginate from "mongoose-paginate";

export type PositionDocument = PositionEntity & Document;

@Schema()
export class PositionEntity extends BaseDocument {
  @Prop()
  name: string;

  @Prop({type: [{type: ObjectId, ref: "Department"}]})
  departmentIds: ObjectId[];
}

export const PositionSchema = SchemaFactory.createForClass(PositionEntity).plugin(mongoosePaginate);
